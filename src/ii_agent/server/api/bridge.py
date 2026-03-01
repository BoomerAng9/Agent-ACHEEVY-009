"""Bridge endpoints for connecting external AIMS gateway to ii-agent."""

from __future__ import annotations

import secrets
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from ii_agent.core.config.ii_agent_config import config

router = APIRouter(prefix="/bridge", tags=["Bridge"])


class BridgeHandshakeRequest(BaseModel):
    source: str | None = None
    metadata: dict[str, Any] | None = None


@router.get("/health")
async def bridge_health() -> dict[str, Any]:
    return {
        "status": "ok",
        "bridge_enabled": config.aims_bridge_enabled,
        "aims_gateway_url": config.aims_gateway_url,
        "time": datetime.now(timezone.utc).isoformat(),
    }


@router.post("/handshake")
async def bridge_handshake(
    payload: BridgeHandshakeRequest,
    x_ii_bridge_key: str | None = Header(default=None),
) -> dict[str, Any]:
    if not config.aims_bridge_enabled:
        raise HTTPException(status_code=409, detail="AIMS bridge is disabled")

    secret = config.aims_bridge_shared_secret
    if secret:
        if not x_ii_bridge_key or not secrets.compare_digest(x_ii_bridge_key, secret):
            raise HTTPException(status_code=401, detail="Invalid bridge credentials")

    return {
        "accepted": True,
        "source": payload.source,
        "gateway": config.aims_gateway_url,
        "time": datetime.now(timezone.utc).isoformat(),
    }
