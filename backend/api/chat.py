from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from rag.pipeline import stream_response

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    language: str = "auto"  # reserved for future use


@router.post("/chat")
async def chat(req: ChatRequest):
    return StreamingResponse(
        stream_response(req.question),
        media_type="text/plain; charset=utf-8",
    )
