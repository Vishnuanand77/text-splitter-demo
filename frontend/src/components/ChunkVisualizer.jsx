import HighlightedText from './HighlightedText';
import ChunkCard from './ChunkCard';

export default function ChunkVisualizer({
  text,
  chunks,
  hoveredIndex,
  onHoverIndex,
}) {
  if (!chunks || chunks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Chunks will appear here after you click "Chunk"
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full">
      {/* Highlighted original text */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Highlighted Text
        </p>
        <div className="p-3 bg-gray-50 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
          <HighlightedText
            text={text}
            chunks={chunks}
            hoveredIndex={hoveredIndex}
            onHoverIndex={onHoverIndex}
          />
        </div>
      </div>

      {/* Chunk cards */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          {chunks.length} Chunk{chunks.length !== 1 && 's'}
        </p>
        <div className="flex flex-col gap-2">
          {chunks.map((chunk) => (
            <ChunkCard
              key={chunk.index}
              chunk={chunk}
              isHovered={hoveredIndex === chunk.index}
              onHover={() => onHoverIndex(chunk.index)}
              onLeave={() => onHoverIndex(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
