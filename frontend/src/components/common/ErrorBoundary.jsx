import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 40, textAlign: 'center', color: '#888780' }}>
        <h2>Something went wrong</h2>
        <button onClick={() => this.setState({ hasError: false })} style={{
          padding: '6px 14px', borderRadius: 6, border: '0.5px solid #e8e6df',
          background: '#fff', cursor: 'pointer', fontSize: 12
        }}>Try Again</button>
      </div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
