/** Canvas-safe colors — mirror tokens.css (light museum palette) */
export const colors = {
  bgCanvas: "#faf8f5",
  bgDeep: "#faf8f5",
  bgSurface: "#ffffff",
  bgPanel: "#ffffff",
  bgStage: "#f7f5f1",
  bgInset: "#ede9e3",
  ink: "#1a1614",
  inkMuted: "#6b6560",
  discover: "#d95e3f",
  accent: "#d95e3f",
  onAccent: "#ffffff",
  nnInput: "#2e86ab",
  nnHidden: "#7b5ea7",
  nnOutput: "#d95e3f",
  nnSignal: "#1fa896",
  nnBlame: "#d64545",
  nnActivation: "#2d9b6a",
  mint: "#2d9b6a",
  violet: "#7b5ea7",
  coral: "#d64545",
  sky: "#2e86ab",
  gold: "#c8860a",
  danger: "#d64545",
  borderSubtle: "#e8e4de",
} as const;

export type ThemeColor = keyof typeof colors;
