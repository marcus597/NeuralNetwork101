export type Point = { x: number; y: number; label: 0 | 1 };

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function predictSide(
  x: number,
  y: number,
  angle: number,
  offset: number,
): 0 | 1 {
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);
  const value = nx * x + ny * y + offset;
  return value >= 0 ? 1 : 0;
}

export function accuracy(
  points: Point[],
  angle: number,
  offset: number,
): number {
  if (points.length === 0) return 0;
  const correct = points.filter(
    (p) => predictSide(p.x, p.y, angle, offset) === p.label,
  ).length;
  return correct / points.length;
}

export function polyFit(
  xs: number[],
  ys: number[],
  degree: number,
): number[] {
  const n = xs.length;
  const size = degree + 1;
  const matrix: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0),
  );
  const vector: number[] = Array(size).fill(0);

  for (let i = 0; i < n; i++) {
    const powers: number[] = [];
    let p = 1;
    for (let d = 0; d < size; d++) {
      powers.push(p);
      p *= xs[i];
    }
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        matrix[r][c] += powers[r] * powers[c];
      }
      vector[r] += powers[r] * ys[i];
    }
  }

  return gaussianElimination(matrix, vector);
}

function gaussianElimination(matrix: number[][], vector: number[]): number[] {
  const n = vector.length;
  const aug = matrix.map((row, i) => [...row, vector[i]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[pivot][col])) pivot = row;
    }
    [aug[col], aug[pivot]] = [aug[pivot], aug[col]];

    const div = aug[col][col] || 1e-9;
    for (let j = col; j <= n; j++) aug[col][j] /= div;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  return aug.map((row) => row[n]);
}

export function evalPoly(coeffs: number[], x: number): number {
  let result = 0;
  let power = 1;
  for (const c of coeffs) {
    result += c * power;
    power *= x;
  }
  return result;
}

export function mse(xs: number[], ys: number[], coeffs: number[]): number {
  if (xs.length === 0) return 0;
  const err = xs.reduce((sum, x, i) => {
    const pred = evalPoly(coeffs, x);
    return sum + (pred - ys[i]) ** 2;
  }, 0);
  return err / xs.length;
}
