import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Conquest render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main
          role="alert"
          style={{
            minHeight: "100vh",
            padding: "2rem",
            background: "#0f1419",
            color: "#f4f6f8",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p style={{ color: "#ef4444", fontWeight: 600 }}>Conquest failed to load</p>
          <pre
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#1a2332",
              borderRadius: "0.5rem",
              overflow: "auto",
              color: "#9aa5b4",
              fontSize: "0.875rem",
            }}
          >
            {this.state.error.message}
          </pre>
          <p style={{ color: "#9aa5b4", marginTop: "1rem" }}>
            Check the browser console and confirm <code>pnpm dev</code> is running (API on 3001, web on 5173).
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}
