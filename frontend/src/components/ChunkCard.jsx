import { getChunkColorHex } from '../utils/colors';

export default function ChunkCard({ chunk, isHovered, onHover, onLeave }) {
  return (
    <div
      className="p-3 rounded-md transition-all duration-150 cursor-default border"
      style={{
        backgroundColor: getChunkColorHex(chunk.index),
        borderColor: isHovered ? '#4f46e5' : 'transparent',
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        boxShadow: isHovered ? '0 2px 8px rgba(79,70,229,0.25)' : 'none',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex justify-between text-xs text-gray-600 mb-1 font-medium">
        <span className="flex gap-2 items-center">
          <span>Chunk {chunk.index}</span>
          {chunk.node_type && (
            <span className="px-1.5 py-0.5 bg-white/60 rounded text-[10px] text-gray-700">
              {chunk.node_type}
            </span>
          )}
        </span>
        <span className="flex gap-2">
          <span>[{chunk.start}:{chunk.end}]</span>
          <span>{chunk.end - chunk.start} chars</span>
          {chunk.token_count != null && (
            <span className="text-indigo-600">{chunk.token_count} tokens</span>
          )}
        </span>
      </div>
      <p className="text-sm font-mono whitespace-pre-wrap break-words text-gray-800 line-clamp-4">
        {chunk.text}
      </p>
    </div>
  );
}
