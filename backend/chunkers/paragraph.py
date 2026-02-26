import re

"""
The simplest semantic-aware splitting — paragraphs are natural
units of thought in most written text. It splits the text on double newlines.
"""


def paragraph_chunk(text: str) -> list[dict]:
    """
    Split text on paragraph boundaries (double newlines).
    The simplest semantic-aware splitting — paragraphs are natural
    units of thought in most written text.
    """
    # Regex to split the text on double newlines
    parts = re.split(r'(\n\s*\n)', text)

    chunks = []
    offset = 0
    index = 0

    for part in parts:
        # Calculate the end index of the part
        end = offset + len(part)
        # Strip the part of whitespace
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
        # Increment the offset by the length of each part so that substring matching
        offset = end
    # Return the chunks
    return chunks


"""
# (text.index) in the next iteration starts searching after the end of the last matched part.
        # Example:
        #   text = "Hello\n\nWorld"
        #   re.split(...) =>
        #       ['Hello', '\n\n', 'World']
        #   Processing:
        #     - First part: 'Hello'
        #         offset = 0
        #         end = 0 + len('Hello') = 5
        #         offset is updated to 5
        #     - Second part: '\n\n'
        #         offset = 5
        #         end = 5 + len('\n\n') = 7
        #         offset is updated to 7
        #     - Third part: 'World'
        #         offset = 7
        #         end = 7 + len('World') = 12
        #         offset is updated to 12
        #   This process ensures that start_in_text will always find the correct position of each paragraph.
"""