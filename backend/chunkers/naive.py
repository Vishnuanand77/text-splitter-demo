def naive_chunk(text: str, chunk_size: int = 200, overlap: int = 0) -> list[dict]:
    """
    Split text into fixed-size character chunks with optional overlap.

    The simplest possible chunking strategy: walk through the text in steps
    of (chunk_size - overlap), slicing out chunk_size characters each time.
    Overlap lets consecutive chunks share context at their boundaries.
    """
    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive")
    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("overlap must be >= 0 and < chunk_size")

    chunks = []
    step = chunk_size - overlap
    start = 0
    index = 0

    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append({
            "text": text[start:end],
            "start": start,
            "end": end,
            "index": index,
        })
        index += 1
        start += step

    return chunks
