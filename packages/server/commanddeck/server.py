"""FastAPI WebSocket server for CommandDeck events."""

import asyncio
import json
import logging
from contextlib import asynccontextmanager
from typing import Set

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .events import CommandDeckEvent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections and broadcasts."""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, event: CommandDeckEvent):
        """Broadcast event to all connected clients."""
        if not self.active_connections:
            logger.debug("No clients connected, skipping broadcast")
            return

        message = event.model_dump_json()
        disconnected = set()

        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.warning(f"Failed to send to client: {e}")
                disconnected.add(connection)

        # Clean up disconnected clients
        self.active_connections -= disconnected


manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    logger.info("CommandDeck server starting...")
    logger.info("WebSocket endpoint: ws://localhost:8765/ws")
    logger.info("Event injection: POST http://localhost:8765/event")
    yield
    logger.info("CommandDeck server shutting down...")


app = FastAPI(
    title="CommandDeck Server",
    description="WebSocket event server for tactical agent visualization",
    version="0.1.0",
    lifespan=lifespan,
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time event streaming."""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            try:
                # Parse and validate incoming events
                event = CommandDeckEvent.model_validate_json(data)
                logger.info(f"Received event: {event.type} from {event.agent_id}")
                # Broadcast to all clients (including sender)
                await manager.broadcast(event)
            except Exception as e:
                logger.error(f"Invalid event data: {e}")
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/event", response_model=dict)
async def inject_event(event: CommandDeckEvent):
    """Inject an event via HTTP POST (for testing)."""
    logger.info(f"Injecting event: {event.type} for {event.agent_id}")
    await manager.broadcast(event)
    return {"status": "ok", "connections": len(manager.active_connections)}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "connections": len(manager.active_connections),
    }


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "CommandDeck Server",
        "version": "0.1.0",
        "endpoints": {
            "websocket": "ws://localhost:8765/ws",
            "inject_event": "POST /event",
            "health": "GET /health",
        },
    }


def main():
    """Run the server."""
    uvicorn.run(
        "commanddeck.server:app",
        host="0.0.0.0",
        port=8765,
        reload=True,
        log_level="info",
    )


if __name__ == "__main__":
    main()
