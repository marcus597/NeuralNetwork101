/** Canvas-safe colors — mirror tokens.css (editorial palette) */
export const colors = {
  bgCanvas: "#f2efe8",
  bgDeep: "#ebe7de",
  bgSurface: "#faf8f4",
  bgPanel: "#faf8f4",
  bgStage: "#f7f4ed",
  bgInset: "#e8e3d8",
  ink: "#111111",
  inkMuted: "#3d3d3d",
  discover: "#111111",
  accent: "#111111",
  onAccent: "#f2efe8",
  nnInput: "#3d5a80",
  nnHidden: "#5c4d7a",
  nnOutput: "#8b3a3a",
  nnSignal: "#2f6b5a",
  nnBlame: "#8b3a3a",
  nnActivation: "#2f6b5a",
  mint: "#2f6b5a",
  violet: "#5c4d7a",
  coral: "#8b3a3a",
  sky: "#3d5a80",
  gold: "#9a7b3c",
  danger: "#8b3a3a",
  borderSubtle: "#cfc8ba",
} as const;

export type ThemeColor = keyof typeof colors;
