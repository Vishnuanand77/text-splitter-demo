# Two types of sentence chunking:
# 1. NLTK's Punkt tokenizer
# 2. spaCy's dependency-parse-based sentence segmenter
import nltk
import spacy

"""
Both approaches are rule-based, meaning they use pre-defined rules to split the text into sentences.
The main difference is the level of granularity:
- NLTK's Punkt tokenizer splits the text into sentences based on punctuation and capitalization patterns.
- spaCy's dependency-parse-based sentence segmenter splits the text into sentences based on grammatical structure.

In practice, spaCy's approach is more accurate because it understands grammatical structure,
while NLTK's approach is more simple and fast.

However, spaCy's approach is more complex and slower to train, so it's not always the best choice.
"""

try:
    _nlp = spacy.load("en_core_web_sm")
except OSError:
    _nlp = None

# NLTK's Punkt tokenizer
def sentence_chunk_nltk(text: str) -> list[dict]:
    """
    Split text into sentences using NLTK's Punkt tokenizer.
    Uses a pre-trained model that looks at punctuation + capitalization
    patterns to find sentence boundaries.
    """
    sentences = nltk.sent_tokenize(text)
    chunks = []
    offset = 0
    for i, sent in enumerate(sentences):
        start = text.index(sent, offset)
        end = start + len(sent)
        chunks.append({"text": sent, "start": start, "end": end, "index": i})
        offset = end
    return chunks

# spaCy's dependency-parse-based sentence segmenter
def sentence_chunk_spacy(text: str) -> list[dict]:
    """
    Split text into sentences using spaCy's dependency-parse-based
    sentence segmenter. More accurate than rule-based approaches because
    it understands grammatical structure.
    """
    if _nlp is None:
        raise RuntimeError("spaCy model 'en_core_web_sm' not installed")

    doc = _nlp(text)
    chunks = []
    for i, sent in enumerate(doc.sents):
        chunks.append({
            "text": sent.text,
            "start": sent.start_char,
            "end": sent.end_char,
            "index": i,
        })
    return chunks


