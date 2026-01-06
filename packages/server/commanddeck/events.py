"""Event schema for CommandDeck agent events."""

import time
from typing import Literal, Optional

from pydantic import BaseModel, Field


class CommandDeckEvent(BaseModel):
    """Event representing an agent action in the tactical visualization."""

    type: Literal["spawn", "move", "work", "progress", "complete", "error", "idle"]
    agent_id: str
    agent_type: Literal["scout", "worker", "coder", "architect", "debugger"]
    target: Optional[str] = None
    target_pos: Optional[tuple[float, float, float]] = None
    progress: Optional[int] = None
    message: Optional[str] = None
    timestamp: float = Field(default_factory=time.time)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "type": "spawn",
                    "agent_id": "agent-001",
                    "agent_type": "scout",
                    "target_pos": (0.0, 0.0, 0.0),
                    "message": "Scout deployed",
                },
                {
                    "type": "move",
                    "agent_id": "agent-001",
                    "agent_type": "scout",
                    "target": "src/utils.ts",
                    "target_pos": (5.0, 0.0, 3.0),
                },
                {
                    "type": "work",
                    "agent_id": "agent-002",
                    "agent_type": "coder",
                    "target": "src/components/App.tsx",
                    "progress": 0,
                    "message": "Starting code analysis",
                },
                {
                    "type": "progress",
                    "agent_id": "agent-002",
                    "agent_type": "coder",
                    "progress": 50,
                    "message": "Refactoring in progress",
                },
                {
                    "type": "complete",
                    "agent_id": "agent-002",
                    "agent_type": "coder",
                    "target": "src/components/App.tsx",
                    "message": "Refactoring complete",
                },
                {
                    "type": "error",
                    "agent_id": "agent-003",
                    "agent_type": "debugger",
                    "target": "tests/unit.test.ts",
                    "message": "Test failed: assertion error",
                },
            ]
        }
    }
