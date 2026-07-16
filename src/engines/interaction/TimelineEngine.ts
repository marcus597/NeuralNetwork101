import type { TimelineState, TimelineStep } from "@/engines/interaction/types";

export class TimelineEngine<T = Record<string, unknown>> {
  private steps: TimelineStep<T>[] = [];
  private index = 0;
  private playing = false;
  private speed = 1;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onStep: ((step: TimelineStep<T>, index: number) => void) | null = null;

  constructor(steps: TimelineStep<T>[] = []) {
    this.steps = steps;
  }

  setSteps(steps: TimelineStep<T>[]): void {
    this.steps = steps;
    this.index = Math.min(this.index, Math.max(0, steps.length - 1));
  }

  getState(): TimelineState {
    return {
      steps: this.steps as TimelineStep[],
      currentIndex: this.index,
      playing: this.playing,
      speed: this.speed,
    };
  }

  getCurrent(): TimelineStep<T> | null {
    return this.steps[this.index] ?? null;
  }

  onStepChange(cb: (step: TimelineStep<T>, index: number) => void): void {
    this.onStep = cb;
  }

  play(intervalMs = 280): void {
    if (this.playing || this.steps.length === 0) return;
    this.playing = true;
    this.intervalId = setInterval(() => {
      if (this.index >= this.steps.length - 1) {
        this.pause();
        return;
      }
      this.index += 1;
      this.emit();
    }, intervalMs / this.speed);
  }

  pause(): void {
    this.playing = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  stepForward(): void {
    if (this.index < this.steps.length - 1) {
      this.index += 1;
      this.emit();
    }
  }

  stepBack(): void {
    if (this.index > 0) {
      this.index -= 1;
      this.emit();
    }
  }

  rewind(): void {
    this.index = 0;
    this.emit();
  }

  seek(index: number): void {
    this.index = Math.max(0, Math.min(index, this.steps.length - 1));
    this.emit();
  }

  setSpeed(speed: number): void {
    this.speed = Math.max(0.25, Math.min(speed, 4));
    if (this.playing) {
      this.pause();
      this.play();
    }
  }

  destroy(): void {
    this.pause();
    this.onStep = null;
  }

  private emit(): void {
    const step = this.getCurrent();
    if (step && this.onStep) this.onStep(step, this.index);
  }
}
