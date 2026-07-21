/** 1D convolution for grid demos. */

export function convolve1d(input: number[], kernel: number[]): number[] {
  const k = kernel.length;
  const pad = Math.floor(k / 2);
  const out: number[] = [];
  for (let i = 0; i < input.length; i++) {
    let sum = 0;
    for (let j = 0; j < k; j++) {
      const idx = i + j - pad;
      if (idx >= 0 && idx < input.length) sum += input[idx] * kernel[j];
    }
    out.push(sum);
  }
  return out;
}

export function convolve2d(
  grid: number[][],
  kernel: number[][],
): number[][] {
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  const kh = kernel.length;
  const kw = kernel[0]?.length ?? 0;
  const ph = Math.floor(kh / 2);
  const pw = Math.floor(kw / 2);
  const out: number[][] = Array.from({ length: h }, () => Array(w).fill(0));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let ky = 0; ky < kh; ky++) {
        for (let kx = 0; kx < kw; kx++) {
          const gy = y + ky - ph;
          const gx = x + kx - pw;
          if (gy >= 0 && gy < h && gx >= 0 && gx < w) {
            sum += grid[gy][gx] * kernel[ky][kx];
          }
        }
      }
      out[y][x] = sum;
    }
  }
  return out;
}

export const EDGE_KERNEL = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1],
];

export const BLUR_KERNEL = [
  [1 / 9, 1 / 9, 1 / 9],
  [1 / 9, 1 / 9, 1 / 9],
  [1 / 9, 1 / 9, 1 / 9],
];

export function defaultDigitGrid(): number[][] {
  return [
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
}
