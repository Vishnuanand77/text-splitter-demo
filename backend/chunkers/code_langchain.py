from langchain_text_splitters import RecursiveCharacterTextSplitter, Language

SUPPORTED_LANGUAGES = {
    "python": Language.PYTHON,
    "javascript": Language.JS,
    "typescript": Language.TS,
    "html": Language.HTML,
    "markdown": Language.MARKDOWN,
    "java": Language.JAVA,
    "go": Language.GO,
    "ruby": Language.RUBY,
    "rust": Language.RUST,
    "cpp": Language.CPP,
    "scala": Language.SCALA,
    "swift": Language.SWIFT,
    "latex": Language.LATEX,
    "php": Language.PHP,
}


def code_langchain_chunk(
    text: str,
    language: str = "python",
    chunk_size: int = 200,
    overlap: int = 0,
) -> list[dict]:
    """
    LangChain's language-aware recursive splitter. It uses separators
    tuned for the chosen language's syntax — e.g. for Python it splits
    on class/function definitions first, then newlines, then spaces.
    For HTML it splits on tags like </div>, </p>, <br> etc.
    """
    lang_enum = SUPPORTED_LANGUAGES.get(language)
    if lang_enum is None:
        raise ValueError(
            f"Unsupported language: {language}. "
            f"Supported: {', '.join(sorted(SUPPORTED_LANGUAGES))}"
        )

    splitter = RecursiveCharacterTextSplitter.from_language(
        language=lang_enum,
        chunk_size=chunk_size,
        chunk_overlap=overlap,
    )

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
