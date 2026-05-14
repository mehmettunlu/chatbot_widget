from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # LLM provider: "openai" or "groq"
    LLM_PROVIDER: str = "openai"

    # OpenAI (used when LLM_PROVIDER=openai)
    OPENAI_API_KEY: str = ""
    MODEL_NAME: str = "gpt-4o-mini"

    # Groq (used when LLM_PROVIDER=groq)
    GROQ_API_KEY: str = ""
    GROQ_MODEL_NAME: str = "llama-3.3-70b-versatile"

    # Embeddings provider: "openai" or "huggingface"
    EMBEDDING_PROVIDER: str = "huggingface"
    EMBEDDING_MODEL: str = "paraphrase-multilingual-MiniLM-L12-v2"

    CHROMA_PERSIST_DIR: str = "./chroma_data"
    COLLECTION_NAME: str = "documents"
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K: int = 4
    ALLOW_ORIGINS: str = "*"

    class Config:
        env_file = ".env"


settings = Settings()
