# Text Chunking Visualizer

A full-stack web app for exploring how different text chunking strategies split your text. Paste or load sample text, pick a chunking method, and instantly see the resulting chunks highlighted in context — with a side-by-side compare mode to evaluate two strategies at once.

## Features

- **9 chunking methods** — Naive (fixed-size), NLTK sentences, spaCy sentences, paragraph, LangChain recursive, LlamaIndex sentence, tiktoken token-based, Python AST, and LangChain language-aware code splitting
- **Live preview** — chunks update automatically as you type or change settings
- **Compare mode** — run two methods side-by-side on the same input
- **Highlighted text** — hover a chunk card to see exactly where it lands in the original text
- **Per-chunk stats** — character counts, offsets, and token counts where applicable
- **Sample texts** — built-in examples to get started quickly
- **14 programming languages** supported for code-aware splitting (Python, JavaScript, TypeScript, Java, Go, Rust, C++, and more)

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19, Tailwind CSS 4, Vite 7   |
| Backend  | FastAPI, Pydantic                   |
| NLP      | NLTK, spaCy, LangChain, LlamaIndex, tiktoken |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# One-time downloads
python -m nltk.downloader punkt_tab
python -m spacy download en_core_web_sm

uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API

### `POST /api/chunk`

Split text using the chosen method.

**Request body:**

```json
{
  "text": "Your text here...",
  "method": "naive",
  "chunk_size": 200,
  "overlap": 0,
  "separators": ["\n\n", "\n", " ", ""],
  "encoding_name": "cl100k_base",
  "language": "python"
}
```

**Response:**

```json
{
  "chunks": [
    { "text": "...", "start": 0, "end": 200, "index": 0 }
  ]
}
```

### `GET /api/languages`

Returns the list of supported programming languages for code-aware splitting.

## Chunking Methods

| Method | Description |
| --- | --- |
| `naive` | Fixed-size character windows with optional overlap |
| `sentence_nltk` | Sentence boundaries via NLTK's Punkt tokenizer |
| `sentence_spacy` | Sentence boundaries via spaCy's dependency parser |
| `paragraph` | Splits on double newlines |
| `recursive_langchain` | LangChain recursive splitter with configurable separators |
| `llamaindex_sentence` | LlamaIndex sentence-aware splitter |
| `tiktoken` | Token-count-based splitting using OpenAI's tiktoken |
| `ast_python` | Python AST-aware splitting (classes, functions) |
| `code_langchain` | Language-aware code splitting for 14 languages |

## Project Structure

```
├── backend/
│   ├── main.py                  # FastAPI app & routes
│   ├── requirements.txt
│   └── chunkers/
│       ├── naive.py             # Fixed-size character chunking
│       ├── sentence.py          # NLTK & spaCy sentence chunking
│       ├── paragraph.py         # Paragraph-boundary chunking
│       ├── recursive.py         # LangChain recursive splitter
│       ├── llamaindex_.py       # LlamaIndex sentence splitter
│       ├── tiktoken_.py         # Token-based chunking
│       ├── ast_chunker.py       # Python AST chunking
│       └── code_langchain.py    # Language-aware code chunking
└── frontend/
    └── src/
        ├── App.jsx              # Main app with compare mode
        ├── api/chunk.js         # Backend API client
        ├── components/
        │   ├── TextInput.jsx    # Text editor pane
        │   ├── SettingsPanel.jsx # Method & parameter controls
        │   ├── ChunkVisualizer.jsx
        │   ├── HighlightedText.jsx
        │   ├── ChunkCard.jsx
        │   └── StatsBar.jsx
        └── utils/
            ├── colors.js        # Chunk color palette
            └── sampleTexts.js   # Built-in example texts
```
