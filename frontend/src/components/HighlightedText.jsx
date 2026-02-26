import { getChunkColorHex } from '../utils/colors';

export default function HighlightedText({
  text,
  chunks,
  hoveredIndex,
  onHoverIndex,
}) {
  if (!chunks || chunks.length === 0) {
    return (
      <p className="text-sm font-mono whitespace-pre-wrap text-gray-400">
        {text || 'Your highlighted text will appear here...'}
      </p>
    );
  }

  const segments = buildSegments(text, chunks);

  return (
    <div className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.chunkIndices.length === 0) {
          return <span key={i}>{seg.text}</span>;
        }

        const isOverlap = seg.chunkIndices.length > 1;
        const isHovered =
          hoveredIndex !== null && seg.chunkIndices.includes(hoveredIndex);

        const color0 = getChunkColorHex(seg.chunkIndices[0]);
        const color1 = isOverlap ? getChunkColorHex(seg.chunkIndices[1]) : null;

        const style = isOverlap
          ? {
              background: `repeating-linear-gradient(
                -45deg,
                ${color0},
                ${color0} 4px,
                ${color1} 4px,
                ${color1} 8px
              )`,
              borderBottom: '2px solid rgba(99, 102, 241, 0.6)',
              opacity: hoveredIndex === null || isHovered ? 1 : 0.35,
              transition: 'opacity 0.15s',
            }
          : {
              backgroundColor: color0,
              opacity: hoveredIndex === null || isHovered ? 1 : 0.35,
              transition: 'opacity 0.15s',
            };

        return (
          <span
            key={i}
            className="relative group rounded-sm px-[1px] cursor-default text-gray-900"
            style={style}
            onMouseEnter={() => onHoverIndex(seg.chunkIndices[0])}
            onMouseLeave={() => onHoverIndex(null)}
          >
            {seg.text}
            {isOverlap && (
              <span
                className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2
                           bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded
                           opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
              >
                overlap: chunks {seg.chunkIndices.join(' & ')}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function buildSegments(text, chunks) {
  const boundaries = new Set();
  boundaries.add(0);
  boundaries.add(text.length);
  for (const c of chunks) {
    boundaries.add(c.start);
    boundaries.add(c.end);
  }

  const sorted = [...boundaries].sort((a, b) => a - b);
  const segments = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];
    const chunkIndices = chunks
      .filter((c) => c.start <= start && c.end >= end)
      .map((c) => c.index);

    segments.push({
      text: text.slice(start, end),
      start,
      end,
      chunkIndices,
    });
  }

  return segments;
}
