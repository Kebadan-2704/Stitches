import React, { Component } from 'react';
import '../styles/error.css';

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
        <div className="error-container">
          <div className="error-bg-glow"></div>
          
          <div className="error-content">
            {/* Custom Couture Broken Thread SVG */}
            <svg className="error-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" stroke="#C9A96E" strokeWidth="1" strokeOpacity="0.3" />
              <path className="broken-thread" d="M20 80 Q 40 50 45 45" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" />
              <path className="broken-thread" d="M80 20 Q 60 40 55 45" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" />
              {/* Needle falling */}
              <g transform="translate(48, 48) rotate(45)">
                <path d="M 0,0 L -20,-1 L -20,1 Z" fill="#C9A96E" />
                <circle cx="-18" cy="0" r="0.5" fill="#1A0A0F" />
              </g>
            </svg>

            <span className="error-label">System Error</span>
            <h1 className="error-title">A dropped <em>stitch.</em></h1>
            <p className="error-message">
              We apologize, but it seems a thread has come loose on our end. Please refresh the page to restore the fabric of the website.
            </p>
            
            <button className="btn-reload" onClick={() => window.location.reload()}>
              <span>Restitch & Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
