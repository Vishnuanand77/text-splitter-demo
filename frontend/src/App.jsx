import { useState, useEffect, useRef, useCallback } from 'react';
import TextInput from './components/TextInput';
import SettingsPanel from './components/SettingsPanel';
import ChunkVisualizer from './components/ChunkVisualizer';
import StatsBar from './components/StatsBar';
import { fetchChunks } from './api/chunk';
import { SAMPLE_TEXTS } from './utils/sampleTexts';

const DEFAULT_SEPARATORS = ['\n\n', '\n', ' ', ''];
const DEBOUNCE_MS = 300;

function useChunkerState() {
  const [method, setMethod] = useState('naive');
  const [chunkSize, setChunkSize] = useState(200);
  const [overlap, setOverlap] = useState(0);
  const [separators, setSeparators] = useState(DEFAULT_SEPARATORS);
  const [language, setLanguage] = useState('python');
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return {
    method, setMethod,
    chunkSize, setChunkSize,
    overlap, setOverlap,
    separators, setSeparators,
    language, setLanguage,
    chunks, setChunks,
    loading, setLoading,
    error, setError,
    hoveredIndex, setHoveredIndex,
  };
}

function useAutoChunk(text, state, setChunkedText) {
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  const run = useCallback(async () => {
    if (!text.trim()) {
      state.setChunks([]);
      state.setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    state.setLoading(true);
    state.setError(null);
    try {
      const payload = {
        text,
        method: state.method,
        chunk_size: state.chunkSize,
        overlap: state.overlap,
      };
      if (state.method === 'recursive_langchain') {
        payload.separators = state.separators;
      }
      if (state.method === 'code_langchain') {
        payload.language = state.language;
      }
      const data = await fetchChunks(payload, controller.signal);
      if (!controller.signal.aborted) {
        state.setChunks(data.chunks);
        setChunkedText(text);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        state.setError(err.message);
        state.setChunks([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        state.setLoading(false);
      }
    }
  }, [text, state.method, state.chunkSize, state.overlap, state.separators, state.language, setChunkedText]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(run, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [run]);
}

export default function App() {
  const [text, setText] = useState('');
  const [chunkedText, setChunkedText] = useState('');
  const [compareMode, setCompareMode] = useState(false);

  const left = useChunkerState();
  const right = useChunkerState();

  useAutoChunk(text, left, setChunkedText);
  useAutoChunk(text, right, setChunkedText);

  function handleSampleSelect(e) {
    const idx = Number(e.target.value);
    if (idx >= 0) {
      setText(SAMPLE_TEXTS[idx].text);
    }
  }

  function renderPanel(state, label) {
    return (
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {compareMode && (
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {label}
          </span>
        )}
        <SettingsPanel
          method={state.method}
          onMethodChange={state.setMethod}
          chunkSize={state.chunkSize}
          onChunkSizeChange={state.setChunkSize}
          overlap={state.overlap}
          onOverlapChange={state.setOverlap}
          separators={state.separators}
          onSeparatorsChange={state.setSeparators}
          language={state.language}
          onLanguageChange={state.setLanguage}
          loading={state.loading}
        />
        <StatsBar chunks={state.chunks} />
        {state.error && (
          <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {state.error}
          </div>
        )}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 overflow-hidden min-h-[300px]">
          <ChunkVisualizer
            text={chunkedText}
            chunks={state.chunks}
            hoveredIndex={state.hoveredIndex}
            onHoverIndex={state.setHoveredIndex}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Text Chunking Visualizer
          </h1>
          <p className="text-sm text-gray-500">
            Explore how different chunking strategies split your text
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={handleSampleSelect}
            defaultValue=""
          >
            <option value="" disabled>
              Load sample text...
            </option>
            {SAMPLE_TEXTS.map((s, i) => (
              <option key={i} value={i}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              compareMode
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {compareMode ? 'Exit Compare' : 'Compare Mode'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex gap-4 p-6 min-h-0">
        <div className="w-[350px] shrink-0 flex flex-col">
          <TextInput value={text} onChange={setText} />
        </div>

        <div className="flex-1 flex gap-4 min-w-0">
          {renderPanel(left, 'Method A')}
          {compareMode && renderPanel(right, 'Method B')}
        </div>
      </div>
    </div>
  );
}
