import os
import shutil
import tempfile

from fastapi import APIRouter, File, UploadFile

from rag.ingestion import ingest_files

router = APIRouter()


@router.post("/ingest")
async def ingest(files: list[UploadFile] = File(...)):
    tmp_dir = tempfile.mkdtemp()
    try:
        file_paths = []
        for upload in files:
            dest = os.path.join(tmp_dir, upload.filename)
            with open(dest, "wb") as f:
                f.write(await upload.read())
            file_paths.append(dest)
        return ingest_files(file_paths)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
