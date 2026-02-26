import nltk
import spacy

try:
    _nlp = spacy.load("en_core_web_sm")
except OSError:
    _nlp = None


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
