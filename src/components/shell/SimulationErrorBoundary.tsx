"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  interactionId?: string;
  children: ReactNode;
};

type State = { hasError: boolean };

export class SimulationErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[SimulationError]", this.props.interactionId, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="panel border-danger/30 p-6 text-center">
          <p className="text-sm font-semibold text-danger">This lab crashed</p>
          <p className="mt-2 text-xs text-ink-muted">
            Something went wrong in the simulation
            {this.props.interactionId ? ` (${this.props.interactionId})` : ""}.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => this.setState({ hasError: false })}
          >
            Reset lab
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
