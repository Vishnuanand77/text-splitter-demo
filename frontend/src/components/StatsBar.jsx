export default function StatsBar({ chunks }) {
  if (!chunks || chunks.length === 0) return null;

  const sizes = chunks.map((c) => c.end - c.start);
  const total = chunks.length;
  const avgSize = Math.round(sizes.reduce((a, b) => a + b, 0) / total);
  const minSize = Math.min(...sizes);
  const maxSize = Math.max(...sizes);

  const hasTokens = chunks.some((c) => c.token_count != null);
  const tokenSizes = hasTokens
    ? chunks.filter((c) => c.token_count != null).map((c) => c.token_count)
    : [];
  const avgTokens = tokenSizes.length
    ? Math.round(tokenSizes.reduce((a, b) => a + b, 0) / tokenSizes.length)
    : null;

  let overlapChars = 0;
  for (let i = 1; i < chunks.length; i++) {
    const prev = chunks[i - 1];
    const curr = chunks[i];
    if (curr.start < prev.end) {
      overlapChars += prev.end - curr.start;
    }
  }

  const stats = [
    { label: 'Chunks', value: total },
    { label: 'Avg Size', value: `${avgSize} chars` },
    { label: 'Min', value: `${minSize} chars` },
    { label: 'Max', value: `${maxSize} chars` },
  ];

  if (overlapChars > 0) {
    stats.push({ label: 'Overlap', value: `${overlapChars} chars` });
  }

  if (avgTokens !== null) {
    stats.push({ label: 'Avg Tokens', value: avgTokens });
  }

  return (
    <div className="flex flex-wrap gap-4 px-4 py-2 bg-white rounded-md border border-gray-200">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center">
          <span className="text-lg font-bold text-indigo-600">{s.value}</span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
