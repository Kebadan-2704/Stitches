import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh', 
          background: '#000814', 
          color: '#C9A96E',
          fontFamily: 'var(--font-body, sans-serif)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '3rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>We're sorry, but an unexpected error occurred.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 32px',
              background: 'transparent',
              border: '1px solid #C9A96E',
              color: '#C9A96E',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
