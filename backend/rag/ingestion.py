import logging
import os

from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import settings
from .vectorstore import get_vectorstore

logger = logging.getLogger(__name__)


def ingest_files(file_paths: list[str]) -> dict:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
    )
    vectorstore = get_vectorstore()
    all_chunks = []
    processed = []

    for path in file_paths:
        ext = os.path.splitext(path)[1].lower()
        filename = os.path.basename(path)

        if ext == ".pdf":
            loader = PyPDFLoader(path)
        elif ext in (".md", ".txt"):
            loader = TextLoader(path, encoding="utf-8")
        else:
            logger.warning("Skipping unsupported file type: %s", filename)
            continue

        docs = loader.load()
        chunks = splitter.split_documents(docs)

        for chunk in chunks:
            chunk.metadata["source"] = filename

        all_chunks.extend(chunks)
        processed.append(filename)

    if all_chunks:
        vectorstore.add_documents(all_chunks)

    return {
        "status": "success",
        "chunks_added": len(all_chunks),
        "files_processed": processed,
    }
