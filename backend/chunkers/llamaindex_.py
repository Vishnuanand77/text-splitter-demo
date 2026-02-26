from llama_index.core.node_parser import SentenceSplitter


def llamaindex_sentence_chunk(
    text: str,
    chunk_size: int = 200,
    overlap: int = 0,
) -> list[dict]:
    """
    LlamaIndex's SentenceSplitter tries to keep sentences intact while
    staying within chunk_size. It uses a secondary "chunking" strategy
    that falls back to splitting mid-sentence only when a single sentence
    exceeds the chunk size.
    """
    splitter = SentenceSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
    )

    nodes = splitter.get_nodes_from_documents(
        [_make_doc(text)]
    )

    chunks = []
    offset = 0
    for i, node in enumerate(nodes):
        content = node.get_content()
        start = text.index(content, offset)
        end = start + len(content)
        chunks.append({
            "text": content,
            "start": start,
            "end": end,
            "index": i,
        })
        offset = start + 1

    return chunks


def _make_doc(text: str):
    """Create a minimal LlamaIndex Document from plain text."""
    from llama_index.core.schema import Document
    return Document(text=text)
