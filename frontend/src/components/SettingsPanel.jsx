import { useState } from 'react';

const METHODS = [
  { value: 'naive', label: 'Naive (Fixed Size)' },
  { value: 'sentence_nltk', label: 'Sentence (NLTK)' },
  { value: 'sentence_spacy', label: 'Sentence (spaCy)' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'recursive_langchain', label: 'Recursive (LangChain)' },
  { value: 'llamaindex_sentence', label: 'Sentence (LlamaIndex)' },
  { value: 'tiktoken', label: 'Token-based (tiktoken)' },
  { value: 'ast_python', label: 'AST (Python)' },
  { value: 'code_langchain', label: 'Code-aware (LangChain)' },
];

const SIZE_METHODS = ['naive', 'recursive_langchain', 'llamaindex_sentence', 'tiktoken', 'code_langchain'];

const CODE_LANGUAGES = [
  'python', 'javascript', 'typescript', 'html', 'markdown',
  'java', 'go', 'ruby', 'rust', 'cpp', 'scala', 'swift', 'latex', 'php',
];

export default function SettingsPanel({
  method,
  onMethodChange,
  chunkSize,
  onChunkSizeChange,
  overlap,
  onOverlapChange,
  separators,
  onSeparatorsChange,
  language,
  onLanguageChange,
  loading,
}) {
  const showSizeControls = SIZE_METHODS.includes(method);
  const showSeparators = method === 'recursive_langchain';
  const showLanguage = method === 'code_langchain';
  const isTiktoken = method === 'tiktoken';
  const [newSep, setNewSep] = useState('');

  function addSeparator() {
    const sep = newSep
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
    if (!separators.includes(sep)) {
      onSeparatorsChange([...separators, sep]);
    }
    setNewSep('');
  }

  function removeSeparator(index) {
    onSeparatorsChange(separators.filter((_, i) => i !== index));
  }

  function displaySep(s) {
    if (s === '\n\n') return '\\n\\n';
    if (s === '\n') return '\\n';
    if (s === '\t') return '\\t';
    if (s === ' ') return '⎵ (space)';
    if (s === '') return '"" (empty)';
    return `"${s}"`;
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-wrap items-end gap-4">
        {/* Method selector */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-500 mb-1">Method</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
          >
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language selector for code-aware chunking */}
        {showLanguage && (
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 mb-1">Language</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              {CODE_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Chunk size */}
        {showSizeControls && (
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 mb-1">
              {isTiktoken ? 'Tokens per Chunk' : 'Chunk Size'}: {chunkSize}
            </label>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={chunkSize}
              onChange={(e) => onChunkSizeChange(Number(e.target.value))}
              className="w-40 accent-indigo-500"
            />
          </div>
        )}

        {/* Overlap */}
        {showSizeControls && (
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 mb-1">
              Overlap: {overlap}
            </label>
            <input
              type="range"
              min={0}
              max={Math.max(0, chunkSize - 1)}
              step={5}
              value={overlap}
              onChange={(e) => onOverlapChange(Number(e.target.value))}
              className="w-40 accent-indigo-500"
            />
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
            Chunking...
          </div>
        )}
      </div>

      {/* Separator chips for recursive method */}
      {showSeparators && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-gray-500">Separators:</span>
          {separators.map((sep, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-800
                         rounded-full text-xs font-mono"
            >
              {displaySep(sep)}
              <button
                onClick={() => removeSeparator(i)}
                className="text-indigo-400 hover:text-indigo-700 font-sans cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="px-2 py-0.5 border border-gray-300 rounded text-xs w-24 font-mono
                       bg-white text-gray-900"
            placeholder="e.g. \n"
            value={newSep}
            onChange={(e) => setNewSep(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSeparator()}
          />
          <button
            onClick={addSeparator}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            + Add
          </button>
        </div>
      )}
    </div>
  );
}
