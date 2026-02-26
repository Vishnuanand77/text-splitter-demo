from langchain_text_splitters import RecursiveCharacterTextSplitter


def recursive_chunk(
    text: str,
    chunk_size: int = 200,
    overlap: int = 0,
    separators: list[str] | None = None,
) -> list[dict]:
    """
    LangChain's RecursiveCharacterTextSplitter tries separators in priority
    order: first split on "\n\n" (paragraphs), then "\n" (lines), then " "
    (words), and finally "" (characters). It keeps chunks under chunk_size
    while preserving as much semantic structure as possible.
    """
    kwargs = {
        "chunk_size": chunk_size,
        "chunk_overlap": overlap,
        "length_function": len,
    }
    if separators:
        kwargs["separators"] = separators

    splitter = RecursiveCharacterTextSplitter(**kwargs)
    docs = splitter.create_documents([text])

    chunks = []
    offset = 0
    for i, doc in enumerate(docs):
        start = text.index(doc.page_content, offset)
        end = start + len(doc.page_content)
        chunks.append({
            "text": doc.page_content,
            "start": start,
            "end": end,
            "index": i,
        })
        offset = start + 1

    return chunks
