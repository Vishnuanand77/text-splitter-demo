/**
 * A palette of distinct, accessible background colors for chunk highlighting.
 * Each color is soft enough to keep text readable on top.
 */
const PALETTE = [
  'bg-amber-200',
  'bg-sky-200',
  'bg-emerald-200',
  'bg-rose-200',
  'bg-violet-200',
  'bg-orange-200',
  'bg-teal-200',
  'bg-pink-200',
  'bg-lime-200',
  'bg-indigo-200',
];

export function getChunkColor(index) {
  return PALETTE[index % PALETTE.length];
}

const PALETTE_HEX = [
  '#fde68a',
  '#bae6fd',
  '#a7f3d0',
  '#fecdd3',
  '#ddd6fe',
  '#fed7aa',
  '#99f6e4',
  '#fbcfe8',
  '#d9f99d',
  '#c7d2fe',
];

export function getChunkColorHex(index) {
  return PALETTE_HEX[index % PALETTE_HEX.length];
}
