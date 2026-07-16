export type CanvasSize = { w: number; h: number; dpr: number };

export class Canvas2D {
  private canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  size: CanvasSize = { w: 0, h: 0, dpr: 1 };

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas2D: no context");
    this.canvas = canvas;
    this.ctx = ctx;
  }

  resize(): CanvasSize {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.size = { w: rect.width, h: rect.height, dpr };
    return this.size;
  }

  clear(): void {
    const { w, h } = this.size;
    this.ctx.clearRect(0, 0, w, h);
  }

  pointerToNorm(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }

  /** Data coords: y-up in [0,1] */
  toScreen(x: number, y: number): { px: number; py: number } {
    const { w, h } = this.size;
    return { px: x * w, py: (1 - y) * h };
  }

  hitRadiusNorm(radiusPx: number): number {
    return radiusPx / Math.min(this.size.w, this.size.h);
  }
}
