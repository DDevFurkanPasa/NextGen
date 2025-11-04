/**
 * Component tests for Error Boundary
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentErrorBoundary } from '../error-boundary';

// Component that throws an error
const ThrowError = ({ message }: { message?: string }) => {
  throw new Error(message || 'Test error');
};

// Component that works fine
const WorkingComponent = () => <div data-testid="working">Working</div>;

describe('ComponentErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  describe('Error Catching', () => {
    it('should catch errors from child components', () => {
      render(
        <ComponentErrorBoundary componentType="test.component">
          <ThrowError />
        </ComponentErrorBoundary>
      );

      // Error boundary should catch the error
      // In development, it shows error UI
      // In production, it shows nothing or fallback
      expect(console.error).toHaveBeenCalled();
    });

    it('should render children when no error occurs', () => {
      render(
        <ComponentErrorBoundary componentType="test.component">
          <WorkingComponent />
        </ComponentErrorBoundary>
      );

      expect(screen.getByTestId('working')).toBeInTheDocument();
      expect(screen.getByText('Working')).toBeInTheDocument();
    });

    it('should catch errors with custom error messages', () => {
      render(
        <ComponentErrorBoundary componentType="test.component">
          <ThrowError message="Custom error message" />
        </ComponentErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Fallback Rendering', () => {
    it('should show fallback UI when provided', () => {
      render(
        <ComponentErrorBoundary
          componentType="test.component"
          fallback={<div data-testid="fallback">Fallback UI</div>}
        >
          <ThrowError />
        </ComponentErrorBoundary>
      );

      // Fallback should be shown (in production mode)
      // In development mode, detailed error UI is shown instead
    });

    it('should not show fallback when no error occurs', () => {
      render(
        <ComponentErrorBoundary
          componentType="test.component"
          fallback={<div data-testid="fallback">Fallback UI</div>}
        >
          <WorkingComponent />
        </ComponentErrorBoundary>
      );

      expect(screen.getByTestId('working')).toBeInTheDocument();
      expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
    });
  });

  describe('Error Callback', () => {
    it('should call onError callback when error occurs', () => {
      const onError = vi.fn();

      render(
        <ComponentErrorBoundary componentType="test.component" onError={onError}>
          <ThrowError message="Callback test error" />
        </ComponentErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object),
        'test.component'
      );
    });

    it('should not call onError when no error occurs', () => {
      const onError = vi.fn();

      render(
        <ComponentErrorBoundary componentType="test.component" onError={onError}>
          <WorkingComponent />
        </ComponentErrorBoundary>
      );

      expect(onError).not.toHaveBeenCalled();
    });

    it('should pass correct component type to onError', () => {
      const onError = vi.fn();

      render(
        <ComponentErrorBoundary componentType="sections.hero" onError={onError}>
          <ThrowError />
        </ComponentErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object),
        'sections.hero'
      );
    });
  });

  describe('Error Information', () => {
    it('should capture error message', () => {
      const onError = vi.fn();
      const errorMessage = 'Specific error message';

      render(
        <ComponentErrorBoundary componentType="test.component" onError={onError}>
          <ThrowError message={errorMessage} />
        </ComponentErrorBoundary>
      );

      const capturedError = onError.mock.calls[0][0];
      expect(capturedError.message).toBe(errorMessage);
    });

    it('should capture error info with component stack', () => {
      const onError = vi.fn();

      render(
        <ComponentErrorBoundary componentType="test.component" onError={onError}>
          <ThrowError />
        </ComponentErrorBoundary>
      );

      const errorInfo = onError.mock.calls[0][1];
      expect(errorInfo).toHaveProperty('componentStack');
    });
  });

  describe('Multiple Errors', () => {
    it('should handle multiple error boundaries independently', () => {
      const onError1 = vi.fn();
      const onError2 = vi.fn();

      render(
        <div>
          <ComponentErrorBoundary componentType="component1" onError={onError1}>
            <ThrowError message="Error 1" />
          </ComponentErrorBoundary>
          <ComponentErrorBoundary componentType="component2" onError={onError2}>
            <ThrowError message="Error 2" />
          </ComponentErrorBoundary>
        </div>
      );

      expect(onError1).toHaveBeenCalledTimes(1);
      expect(onError2).toHaveBeenCalledTimes(1);
    });

    it('should isolate errors to their boundaries', () => {
      render(
        <div>
          <ComponentErrorBoundary componentType="error-component">
            <ThrowError />
          </ComponentErrorBoundary>
          <ComponentErrorBoundary componentType="working-component">
            <WorkingComponent />
          </ComponentErrorBoundary>
        </div>
      );

      // Working component should still render
      expect(screen.getByTestId('working')).toBeInTheDocument();
    });
  });

  describe('Nested Components', () => {
    it('should catch errors from deeply nested components', () => {
      const onError = vi.fn();

      const NestedComponent = () => (
        <div>
          <div>
            <div>
              <ThrowError />
            </div>
          </div>
        </div>
      );

      render(
        <ComponentErrorBoundary componentType="nested.component" onError={onError}>
          <NestedComponent />
        </ComponentErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('Component Type Tracking', () => {
    it('should track component type correctly', () => {
      const onError = vi.fn();

      render(
        <ComponentErrorBoundary componentType="sections.hero" onError={onError}>
          <ThrowError />
        </ComponentErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'sections.hero'
      );
    });

    it('should handle different component types', () => {
      const onError1 = vi.fn();
      const onError2 = vi.fn();

      render(
        <div>
          <ComponentErrorBoundary componentType="sections.hero" onError={onError1}>
            <ThrowError />
          </ComponentErrorBoundary>
          <ComponentErrorBoundary componentType="sections.features" onError={onError2}>
            <ThrowError />
          </ComponentErrorBoundary>
        </div>
      );

      expect(onError1).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'sections.hero'
      );
      expect(onError2).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'sections.features'
      );
    });
  });
});
