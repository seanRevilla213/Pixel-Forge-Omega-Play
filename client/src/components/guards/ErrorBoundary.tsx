import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-matte-black p-6">
          <div className="glasswave rounded-[3rem] p-12 max-w-xl w-full text-center space-y-8">
            <h2 className="font-heading text-4xl font-black text-white uppercase tracking-tighter">
              System <span className="text-luxury-cyan italic">Disruption</span>
            </h2>
            <p className="text-text-secondary leading-relaxed opacity-60">
              A critical rendering error has occurred. The interactive interface has been temporarily suspended to prevent further instability.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="luxury-btn w-full"
            >
              RE-INITIALIZE INTERFACE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
