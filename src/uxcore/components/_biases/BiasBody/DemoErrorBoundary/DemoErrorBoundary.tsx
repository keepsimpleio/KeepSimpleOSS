import { Component, ReactNode } from 'react';

interface DemoErrorBoundaryProps {
  children: ReactNode;
}

interface DemoErrorBoundaryState {
  hasError: boolean;
}

class DemoErrorBoundary extends Component<
  DemoErrorBoundaryProps,
  DemoErrorBoundaryState
> {
  constructor(props: DemoErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): DemoErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: '#9e9e9e', textAlign: 'center' }}>
          Demo unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

export default DemoErrorBoundary;
