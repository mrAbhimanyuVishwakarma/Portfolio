import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env?.DEV) {
      console.warn('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg, #090b10)',
          color: 'var(--text, #ffffff)',
          fontFamily: "'DM Sans', sans-serif"
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ maxWidth: '500px', marginBottom: '1.5rem', opacity: 0.8 }}>
            An unexpected error occurred while rendering the interactive view or game canvas.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--accent, #00B8D4)',
              color: '#090b10',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Reload View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
