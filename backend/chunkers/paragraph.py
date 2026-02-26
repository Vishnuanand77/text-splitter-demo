import re


def paragraph_chunk(text: str) -> list[dict]:
    """
    Split text on paragraph boundaries (double newlines).
    The simplest semantic-aware splitting — paragraphs are natural
    units of thought in most written text.
    """
    parts = re.split(r'(\n\s*\n)', text)

    chunks = []
    offset = 0
    index = 0

    for part in parts:
        end = offset + len(part)
        stripped = part.strip()
        if stripped:
            start_in_text = text.index(stripped, offset)
            chunks.append({
                "text": stripped,
                "start": start_in_text,
                "end": start_in_text + len(stripped),
                "index": index,
            })
            index += 1
        offset = end

    return chunks
