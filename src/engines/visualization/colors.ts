/** Canvas-safe color tokens — mirrors CSS theme. */
export const vizColors = {
  coral: "#ff6b4a",
  mint: "#3dffb5",
  violet: "#8b7cff",
  sky: "#4cc9f0",
  gold: "#ffd166",
  danger: "#ff4d6d",
  inkMuted: "#94a3b8",
  white: "#ffffff",
  labelA: "#3dffb5",
  labelB: "#ff6b4a",
} as const;

export function labelColor(label: number): string {
  return label === 1 ? vizColors.labelB : vizColors.labelA;
}

export function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
