# CommandDeck Server

WebSocket event server for the CommandDeck tactical visualization.

## Installation

```bash
cd packages/server
pip install -e .
```

Or with dependencies only:

```bash
pip install fastapi uvicorn pydantic websockets
```

## Running

```bash
cd packages/server
python -m commanddeck.server
```

Server starts on `http://localhost:8765`

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ws` | WebSocket | Real-time event stream |
| `/event` | POST | Inject events (for testing) |
| `/health` | GET | Health check |
| `/` | GET | API info |

## Event Schema

```python
{
    "type": "spawn" | "move" | "work" | "progress" | "complete" | "error" | "idle",
    "agent_id": "string",
    "agent_type": "scout" | "worker" | "coder" | "architect" | "debugger",
    "target": "optional string (e.g., file path)",
    "target_pos": [x, y, z],  # 3D position
    "progress": 0-100,        # for progress events
    "message": "optional status message",
    "timestamp": 1234567890.123
}
```

## Testing

Run the test script:

```bash
python test_client.py
```

Or inject events via curl:

```bash
# Spawn an agent
curl -X POST http://localhost:8765/event \
  -H "Content-Type: application/json" \
  -d '{"type":"spawn","agent_id":"test-001","agent_type":"scout","target_pos":[0,0,0]}'

# Move the agent
curl -X POST http://localhost:8765/event \
  -H "Content-Type: application/json" \
  -d '{"type":"move","agent_id":"test-001","agent_type":"scout","target_pos":[5,0,3]}'
```

## WebSocket Client Example

```javascript
const ws = new WebSocket('ws://localhost:8765/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};

// Send an event
ws.send(JSON.stringify({
  type: 'move',
  agent_id: 'unit-001',
  agent_type: 'scout',
  target_pos: [10, 0, 5]
}));
```
