import tiktoken


def tiktoken_chunk(
    text: str,
    chunk_size: int = 100,
    overlap: int = 0,
    encoding_name: str = "cl100k_base",
) -> list[dict]:
    """
    Token-aware chunking using tiktoken. Instead of counting characters,
    this splits by token count. This matters because "Hello" is 1 token
    but "Pneumonoultramicroscopicsilicovolcanoconiosis" might be 10+ tokens.
    LLMs have token limits, not character limits.
    """
    enc = tiktoken.get_encoding(encoding_name)
    tokens = enc.encode(text)

    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive")
    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("overlap must be >= 0 and < chunk_size")

    step = chunk_size - overlap
    chunks = []
    index = 0
    start_tok = 0

    while start_tok < len(tokens):
        end_tok = min(start_tok + chunk_size, len(tokens))
        chunk_tokens = tokens[start_tok:end_tok]
        chunk_text = enc.decode(chunk_tokens)

        char_start = text.index(chunk_text) if index == 0 else text.index(chunk_text, chunks[-1]["start"] if overlap > 0 else chunks[-1]["end"] - 1)
        char_end = char_start + len(chunk_text)

        chunks.append({
            "text": chunk_text,
            "start": char_start,
            "end": char_end,
            "index": index,
            "token_count": len(chunk_tokens),
        })
        index += 1
        start_tok += step

    return chunks
