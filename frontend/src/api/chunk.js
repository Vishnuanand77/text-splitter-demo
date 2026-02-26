export async function fetchChunks(payload, signal) {
  const res = await fetch('/api/chunk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Chunking request failed');
  }

  return res.json();
}
