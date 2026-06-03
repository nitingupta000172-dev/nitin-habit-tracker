import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    const { error, info } = this.state;

    if (error) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            backgroundColor: '#0a0a0f',
            color: '#f4f4f5',
            fontFamily: 'monospace',
            padding: '20px',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {/* Red error header */}
          <div
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.5)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '15px', margin: '0 0 6px' }}>
              ⚠ Runtime Error
            </p>
            <p
              style={{
                color: '#fca5a5',
                fontSize: '13px',
                margin: 0,
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
              }}
            >
              {error.message || String(error)}
            </p>
          </div>

          {/* Stack trace */}
          {error.stack && (
            <div
              style={{
                background: '#111118',
                border: '1px solid #1e1e2a',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px',
                overflowX: 'auto',
              }}
            >
              <p style={{ color: '#a1a1aa', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Stack trace
              </p>
              <pre
                style={{
                  color: '#71717a',
                  fontSize: '11px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {error.stack}
              </pre>
            </div>
          )}

          {/* Component stack */}
          {info?.componentStack && (
            <div
              style={{
                background: '#111118',
                border: '1px solid #1e1e2a',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px',
              }}
            >
              <p style={{ color: '#a1a1aa', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Component stack
              </p>
              <pre
                style={{
                  color: '#71717a',
                  fontSize: '11px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {info.componentStack}
              </pre>
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={this.handleReset}
            style={{
              background: '#f59e0b',
              color: '#0a0a0f',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
