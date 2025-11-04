/**
 * Error Boundary Additional Tests
 * Target: 90%+ coverage for renderer/error-boundary.tsx
 */

import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentErrorBoundary } from '../error-boundary';

// Component that throws an error
const ThrowError = ({ message }: { message: string }) => {
  throw new Error(message);
};

// Component that works fine
const WorkingComponent = () => <div>Working Component</div>;

describe('ComponentErrorBoundary', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Normal operation', () => {
    it('should render children when there is no error', () => {
      const { getByText } = render(
        <ComponentErrorBoundary componentType="test-component">
          <WorkingComponent />
        </ComponentErrorBoundary>
      );

      expect(getByText('Working Component')).toBeDefined();
    });

    it('should render multiple children without error', () => {
      const { getByText } = render(
        <ComponentErrorBoundary componentType="test-component">
          <div>Child 1</div>
          <div>Child 2</div>
        </ComponentErrorBoundary>
      );

      expect(getByText('Child 1')).toBeDefined();
      expect(getByText('Child 2')).toBeDefined();
    });
  });

  describe('Error catching', () => {
    it('should catch error from child component', () => {
      const { container } = render(
        <ComponentErrorBoundary componentType="sections.hero">
          <ThrowError message="Test error" />
        </ComponentErrorBoundary>
      );

      // In production mode (default in tests), should render null
      expect(container.firstChild).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should call onError callback when error occurs', () => {
      const onErrorMock = vi.fn();

      render(
        <ComponentErrorBoundary
          componentType="sections.hero"
          onError={onErrorMock}
        >
          <ThrowError message="Callback test error" />
        </ComponentErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
        'sections.hero'
      );
    });

    it('should catch errors with specific error messages', () => {
      const onErrorMock = vi.fn();

      render(
        <ComponentErrorBoundary
          componentType="test-component"
          onError={onErrorMock}
        >
          <ThrowError message="Specific error message" />
        </ComponentErrorBoundary>
      );

      const errorArg = onErrorMock.mock.calls[0][0];
      expect(errorArg.message).toBe('Specific error message');
    });
  });

  describe('Development mode', () => {
    it('should render custom error UI in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const { container } = render(
        <ComponentErrorBoundary componentType="sections.hero">
          <ThrowError message="Dev mode error" />
        </ComponentErrorBoundary>
      );

      // Should have error styling with red border
      const errorDiv = container.querySelector('div[style*="border"]');
      expect(errorDiv).toBeDefined();
      expect(errorDiv?.textContent).toContain('Component Error: sections.hero');
      expect(errorDiv?.textContent).toContain('Dev mode error');

      process.env.NODE_ENV = originalEnv;
    });

    it('should show stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const { getByText } = render(
        <ComponentErrorBoundary componentType="test-component">
          <ThrowError message="Stack trace test" />
        </ComponentErrorBoundary>
      );

      expect(getByText('Stack Trace')).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('should log detailed error in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ComponentErrorBoundary componentType="sections.features">
          <ThrowError message="Detailed logging test" />
        </ComponentErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[StrapiRenderer] Error in component: sections.features',
        '\nError:', expect.any(Error),
        '\nComponent Stack:', expect.any(String)
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Production mode', () => {
    it('should render null (graceful degradation) in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { container } = render(
        <ComponentErrorBoundary componentType="sections.hero">
          <ThrowError message="Production error" />
        </ComponentErrorBoundary>
      );

      // Should render nothing in production
      expect(container.firstChild).toBeNull();

      process.env.NODE_ENV = originalEnv;
    });

    it('should log minimal error info in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ComponentErrorBoundary componentType="sections.cta">
          <ThrowError message="Production logging test" />
        </ComponentErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[StrapiRenderer] Component error: sections.cta',
        'Production logging test'
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not show detailed error UI in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { queryByText } = render(
        <ComponentErrorBoundary componentType="sections.hero">
          <ThrowError message="Production UI test" />
        </ComponentErrorBoundary>
      );

      // Should not show error details
      expect(queryByText(/Component Error:/)).toBeNull();
      expect(queryByText(/Stack Trace/)).toBeNull();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Fallback rendering', () => {
    it('should render fallback when provided in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { getByText } = render(
        <ComponentErrorBoundary
          componentType="sections.hero"
          fallback={<div>Fallback UI</div>}
        >
          <ThrowError message="Fallback test" />
        </ComponentErrorBoundary>
      );

      expect(getByText('Fallback UI')).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('should render fallback instead of null when provided', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { container, getByText } = render(
        <ComponentErrorBoundary
          componentType="test-component"
          fallback={<p>Custom fallback content</p>}
        >
          <ThrowError message="Fallback instead of null" />
        </ComponentErrorBoundary>
      );

      expect(getByText('Custom fallback content')).toBeDefined();
      expect(container.firstChild).not.toBeNull();

      process.env.NODE_ENV = originalEnv;
    });

    it('should not render fallback in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const { queryByText, getByText } = render(
        <ComponentErrorBoundary
          componentType="test-component"
          fallback={<div>This should not show</div>}
        >
          <ThrowError message="Dev fallback test" />
        </ComponentErrorBoundary>
      );

      // Should show error UI, not fallback
      expect(getByText(/Component Error:/)).toBeDefined();
      expect(queryByText('This should not show')).toBeNull();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error state management', () => {
    it('should handle errors with no message', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const NoMessageError = () => {
        const error = new Error();
        error.message = '';
        throw error;
      };

      const { getByText } = render(
        <ComponentErrorBoundary componentType="test-component">
          <NoMessageError />
        </ComponentErrorBoundary>
      );

      expect(getByText(/Unknown error/)).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('should maintain error state after catching error', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { container, rerender } = render(
        <ComponentErrorBoundary componentType="test-component">
          <ThrowError message="Persistent error" />
        </ComponentErrorBoundary>
      );

      expect(container.firstChild).toBeNull();

      // Re-render should still show error state
      rerender(
        <ComponentErrorBoundary componentType="test-component">
          <ThrowError message="Persistent error" />
        </ComponentErrorBoundary>
      );

      expect(container.firstChild).toBeNull();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Component type tracking', () => {
    it('should track different component types correctly', () => {
      const onError1 = vi.fn();
      const onError2 = vi.fn();

      render(
        <ComponentErrorBoundary
          componentType="sections.hero"
          onError={onError1}
        >
          <ThrowError message="Hero error" />
        </ComponentErrorBoundary>
      );

      render(
        <ComponentErrorBoundary
          componentType="sections.features"
          onError={onError2}
        >
          <ThrowError message="Features error" />
        </ComponentErrorBoundary>
      );

      expect(onError1).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object),
        'sections.hero'
      );

      expect(onError2).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object),
        'sections.features'
      );
    });
  });
});
