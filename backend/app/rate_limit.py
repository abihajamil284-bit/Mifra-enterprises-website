import os
import time
from collections import defaultdict
from typing import DefaultDict, List

from fastapi import HTTPException, Request


_REQUEST_LIMIT = int(os.getenv("RATE_LIMIT_REQUESTS", "5"))
_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))

_request_history: DefaultDict[str, List[float]] = defaultdict(list)


def get_rate_limit_config() -> tuple[int, int]:
    return (
        int(os.getenv("RATE_LIMIT_REQUESTS", "5")),
        int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60")),
    )


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit(request: Request):
    limit, window_seconds = get_rate_limit_config()
    client_ip = _get_client_ip(request)
    route_key = f"{request.url.path}:{client_ip}"
    now = time.monotonic()
    timestamps = _request_history[route_key]
    timestamps[:] = [ts for ts in timestamps if now - ts < window_seconds]

    if len(timestamps) >= limit:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again later.",
        )

    timestamps.append(now)
    return None
