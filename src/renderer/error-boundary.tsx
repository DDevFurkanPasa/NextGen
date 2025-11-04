/**
 * Error Boundary for individual Strapi components
 * Prevents single component failure from crashing entire page
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  componentType: string;
  onError?: (error: Error, errorInfo: ErrorInfo, componentType: string) => void;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary that wraps each dynamic component
 * 
 * Features:
 * - Catches React errors in child components
 * - Logs errors in development mode
 * - Shows fallback UI or hides component in production
 * - Calls optional onError callback
 */
export class ComponentErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { componentType, onError } = this.props;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[StrapiRenderer] Error in component: ${componentType}`,
        '\nError:', error,
        '\nComponent Stack:', errorInfo.componentStack
      );
    } else {
      // Log minimal info in production
      console.error(`[StrapiRenderer] Component error: ${componentType}`, error.message);
    }

    // Call optional error callback
    if (onError) {
      onError(error, errorInfo, componentType);
    }
  }

  override render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, componentType, fallback } = this.props;

    if (hasError) {
      // Development mode: show detailed error
      if (process.env.NODE_ENV === 'development') {
        return (
          <div
            style={{
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              margin: '16px 0',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
              ⚠️ Component Error: {componentType}
            </h3>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              <strong>Error:</strong> {error?.message || 'Unknown error'}
            </p>
            <details style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                Stack Trace
              </summary>
              <pre
                style={{
                  overflow: 'auto',
                  padding: '8px',
                  backgroundColor: '#fff',
                  border: '1px solid #fca5a5',
                  borderRadius: '4px',
                }}
              >
                {error?.stack}
              </pre>
            </details>
          </div>
        );
      }

      // Production mode: show fallback or hide component
      if (fallback) {
        return <>{fallback}</>;
      }

      return null;
    }

    return children;
  }
}
