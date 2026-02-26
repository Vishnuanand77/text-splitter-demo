from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

# Import different types of chunkers
from chunkers import (
    naive_chunk,
    sentence_chunk_nltk,
    sentence_chunk_spacy,
    paragraph_chunk,
    recursive_chunk,
    llamaindex_sentence_chunk,
    tiktoken_chunk,
    ast_chunk_python,
    code_langchain_chunk,
    SUPPORTED_LANGUAGES,
)

# Initialize FastAPI app
app = FastAPI(title="Text Chunking Visualizer")

# Add CORS middleware to allow requests from all origins
# React runs on port 5173, so we need to allow requests from that port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the available chunking methods
METHODS = {
    "naive",
    "sentence_nltk",
    "sentence_spacy",
    "paragraph",
    "recursive_langchain",
    "llamaindex_sentence",
    "tiktoken",
    "ast_python",
    "code_langchain",
}

# Define the request model for chunking
# FastAPI automatically validates the request data, 
class ChunkRequest(BaseModel):
    text: str
    method: str = "naive"
    chunk_size: int = Field(default=200, gt=0)
    overlap: int = Field(default=0, ge=0)
    separators: Optional[list[str]] = None
    encoding_name: str = "cl100k_base"
    language: str = "python"

# Define the response model for chunking
class Chunk(BaseModel):
    text: str
    start: int
    end: int
    index: int
    token_count: Optional[int] = None
    node_type: Optional[str] = None

# Define the response model for chunking
class ChunkResponse(BaseModel):
    chunks: list[Chunk]

# Define the GET endpoint for listing the supported languages
@app.get("/api/languages")
def list_languages():
    # Dictionary specified in code_langchain.py and exported in __init__.py
    return {"languages": sorted(SUPPORTED_LANGUAGES.keys())}

# Define the POST endpoint for chunking text with pydantic ChunkResponse model enforced
@app.post("/api/chunk", response_model=ChunkResponse)
def chunk_text(req: ChunkRequest):
    # Check if the method is supported
    if req.method not in METHODS:
        raise HTTPException(400, f"Unknown method: {req.method}")

    # Calling the appropriate chunking function based on the method
    match req.method:
        case "naive":
            chunks = naive_chunk(req.text, req.chunk_size, req.overlap)
        case "sentence_nltk":
            chunks = sentence_chunk_nltk(req.text)
        case "sentence_spacy":
            chunks = sentence_chunk_spacy(req.text)
        case "paragraph":
            chunks = paragraph_chunk(req.text)
        case "recursive_langchain":
            chunks = recursive_chunk(
                req.text, req.chunk_size, req.overlap, req.separators
            )
        case "llamaindex_sentence":
            chunks = llamaindex_sentence_chunk(
                req.text, req.chunk_size, req.overlap
            )
        case "tiktoken":
            chunks = tiktoken_chunk(
                req.text, req.chunk_size, req.overlap, req.encoding_name
            )
        case "ast_python":
            chunks = ast_chunk_python(req.text)
        case "code_langchain":
            chunks = code_langchain_chunk(
                req.text, req.language, req.chunk_size, req.overlap
            )

    return ChunkResponse(chunks=chunks)
