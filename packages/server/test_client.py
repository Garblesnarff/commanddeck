#!/usr/bin/env python3
"""Test client for CommandDeck WebSocket server.

Connects to the server, spawns an agent, and moves it to random positions.
"""

import asyncio
import json
import random
import time

import websockets


async def test_client():
    """Run the test client."""
    uri = "ws://localhost:8765/ws"
    agent_id = f"test-agent-{random.randint(1000, 9999)}"

    print(f"Connecting to {uri}...")

    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected! Agent ID: {agent_id}")

            # Spawn event
            spawn_event = {
                "type": "spawn",
                "agent_id": agent_id,
                "agent_type": "scout",
                "target_pos": [0.0, 0.0, 0.0],
                "message": "Test agent deployed",
                "timestamp": time.time(),
            }
            await websocket.send(json.dumps(spawn_event))
            print(f"Sent: spawn at origin")

            # Listen for broadcast confirmation
            response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
            print(f"Received: {response[:80]}...")

            # Send move events every 2 seconds
            move_count = 0
            while True:
                await asyncio.sleep(2.0)

                # Random position within a 20x20 grid
                x = random.uniform(-10, 10)
                z = random.uniform(-10, 10)

                move_event = {
                    "type": "move",
                    "agent_id": agent_id,
                    "agent_type": "scout",
                    "target_pos": [x, 0.0, z],
                    "message": f"Moving to ({x:.1f}, {z:.1f})",
                    "timestamp": time.time(),
                }
                await websocket.send(json.dumps(move_event))
                move_count += 1
                print(f"Sent move #{move_count}: ({x:.1f}, 0, {z:.1f})")

                # Receive broadcast
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                except asyncio.TimeoutError:
                    pass

    except ConnectionRefusedError:
        print("Error: Could not connect to server. Is it running?")
        print("Start the server with: python -m commanddeck.server")
    except KeyboardInterrupt:
        print("\nTest client stopped.")


def main():
    """Entry point."""
    print("CommandDeck Test Client")
    print("=" * 40)
    print("Press Ctrl+C to stop\n")
    asyncio.run(test_client())


if __name__ == "__main__":
    main()
