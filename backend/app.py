from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from api.chat import router as chat_router
from api.ingest import router as ingest_router

app = FastAPI(title="Multilingual RAG Chatbot", version="0.1.0")

origins = (
    [o.strip() for o in settings.ALLOW_ORIGINS.split(",")]
    if settings.ALLOW_ORIGINS != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(ingest_router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}
