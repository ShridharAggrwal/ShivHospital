import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="container mt-5">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h2>Something went wrong</h2>
            </div>
            <div className="card-body">
              <p>We're sorry - we're experiencing some technical difficulties.</p>
              <p>Try refreshing the page or come back later.</p>
              {this.props.showDetails && (
                <details className="mt-4">
                  <summary>Error Details</summary>
                  <pre className="mt-3 p-3 bg-light">
                    {this.state.error && this.state.error.toString()}
                  </pre>
                </details>
              )}
              <button 
                className="btn btn-primary mt-3" 
                onClick={() => window.location.href = '/'}
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 