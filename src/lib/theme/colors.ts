/** Canvas-safe color constants — mirror tokens.css */
export const colors = {
  bgDeep: "#070b14",
  bgPanel: "#0f1628",
  bgElevated: "#151f36",
  ink: "#eef2ff",
  inkMuted: "#94a3b8",
  coral: "#ff6b4a",
  mint: "#3dffb5",
  violet: "#8b7cff",
  sky: "#4cc9f0",
  gold: "#ffd166",
  danger: "#ff4d6d",
} as const;

export type ThemeColor = keyof typeof colors;
