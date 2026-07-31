/**
 * Traditional 4×4 palace board mapping.
 * Center (rows 2–3, cols 2–3) is reserved for overview.
 * Lookup must use palace.index, never array position.
 */
export const PALACE_GRID_POSITION: Readonly<Record<number, { row: number; col: number }>> = {
  6: { row: 1, col: 1 },
  7: { row: 1, col: 2 },
  8: { row: 1, col: 3 },
  9: { row: 1, col: 4 },
  5: { row: 2, col: 1 },
  10: { row: 2, col: 4 },
  4: { row: 3, col: 1 },
  11: { row: 3, col: 4 },
  3: { row: 4, col: 1 },
  2: { row: 4, col: 2 },
  1: { row: 4, col: 3 },
  12: { row: 4, col: 4 },
};

export const CENTER_GRID_AREA = { rowStart: 2, rowEnd: 3, colStart: 2, colEnd: 3 } as const;

export function getPalaceGridStyle(index: number): { gridRow: number; gridColumn: number } | null {
  const pos = PALACE_GRID_POSITION[index];
  if (!pos) return null;
  return { gridRow: pos.row, gridColumn: pos.col };
}

export function isValidPalaceIndex(index: number): boolean {
  return Number.isInteger(index) && index >= 1 && index <= 12 && index in PALACE_GRID_POSITION;
}
