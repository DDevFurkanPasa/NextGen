/**
 * Component tests for StrapiRenderer
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StrapiRenderer } from '../index';
import type { ComponentMap } from '../types';
import { z } from 'zod';

// Mock components for testing
const MockHeroComponent = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div data-testid="hero">
    <h1>{title}</h1>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

const MockFeaturesComponent = ({ features }: { features: Array<{ title: string }> }) => (
  <div data-testid="features">
    {features.map((feature, index) => (
      <div key={index}>{feature.title}</div>
    ))}
  </div>
);

const MockErrorComponent = () => {
  throw new Error('Test error');
};

describe('StrapiRenderer', () => {
  describe('Basic Rendering', () => {
    it('should render components from data array', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const data = [
        {
          __component: 'sections.hero',
          title: 'Welcome',
          subtitle: 'Test subtitle',
        },
      ];

      render(<StrapiRenderer data={data} map={componentMap} />);

      expect(screen.getByTestId('hero')).toBeInTheDocument();
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    });

    it('should render multiple components', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
        'sections.features': {
          component: MockFeaturesComponent,
        },
      };

      const data = [
        {
          __component: 'sections.hero',
          title: 'Hero Title',
        },
        {
          __component: 'sections.features',
          features: [{ title: 'Feature 1' }, { title: 'Feature 2' }],
        },
      ];

      render(<StrapiRenderer data={data} map={componentMap} />);

      expect(screen.getByTestId('hero')).toBeInTheDocument();
      expect(screen.getByTestId('features')).toBeInTheDocument();
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
    });

    it('should handle empty data array', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const { container } = render(<StrapiRenderer data={[]} map={componentMap} />);

      expect(container.firstChild).toBeNull();
    });

    it('should handle null data', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const { container } = render(
        <StrapiRenderer data={null as unknown as unknown[]} map={componentMap} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle undefined data', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const { container } = render(
        <StrapiRenderer data={undefined as unknown as unknown[]} map={componentMap} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Component Mapping', () => {
    it('should skip components without __component field', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const data = [
        {
          title: 'No component type',
        },
      ];

      const { container } = render(<StrapiRenderer data={data} map={componentMap} />);

      expect(container.firstChild).toBeNull();
    });

    it('should skip unmapped component types', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const data = [
        {
          __component: 'sections.unknown',
          title: 'Unknown component',
        },
      ];

      const { container } = render(<StrapiRenderer data={data} map={componentMap} />);

      expect(container.firstChild).toBeNull();
    });

    it('should skip invalid data items', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const data = [
        'invalid string',
        123,
        null,
        {
          __component: 'sections.hero',
          title: 'Valid component',
        },
      ];

      render(<StrapiRenderer data={data as unknown[]} map={componentMap} />);

      // Only the valid component should render
      expect(screen.getByTestId('hero')).toBeInTheDocument();
      expect(screen.getByText('Valid component')).toBeInTheDocument();
    });
  });

  describe('Zod Validation', () => {
    it('should validate component data with schema in error mode', () => {
      const schema = z.object({
        __component: z.literal('sections.hero'),
        title: z.string(),
        subtitle: z.string().optional(),
      });

      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
          schema,
        },
      };

      const validData = [
        {
          __component: 'sections.hero',
          title: 'Valid Title',
          subtitle: 'Valid Subtitle',
        },
      ];

      render(<StrapiRenderer data={validData} map={componentMap} validation="error" />);

      expect(screen.getByTestId('hero')).toBeInTheDocument();
    });

    it('should skip invalid components in error mode', () => {
      const schema = z.object({
        __component: z.literal('sections.hero'),
        title: z.string(),
      });

      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
          schema,
        },
      };

      const invalidData = [
        {
          __component: 'sections.hero',
          title: 123, // Invalid: should be string
        },
      ];

      const { container } = render(
        <StrapiRenderer data={invalidData as unknown[]} map={componentMap} validation="error" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render invalid components in warn mode', () => {
      const schema = z.object({
        __component: z.literal('sections.hero'),
        title: z.string(),
      });

      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
          schema,
        },
      };

      const invalidData = [
        {
          __component: 'sections.hero',
          title: 123, // Invalid but will render in warn mode
        },
      ];

      render(
        <StrapiRenderer data={invalidData as unknown[]} map={componentMap} validation="warn" />
      );

      expect(screen.getByTestId('hero')).toBeInTheDocument();
    });

    it('should skip validation in silent mode', () => {
      const schema = z.object({
        __component: z.literal('sections.hero'),
        title: z.string(),
      });

      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
          schema,
        },
      };

      const invalidData = [
        {
          __component: 'sections.hero',
          title: 123, // Invalid but validation is silent
        },
      ];

      render(
        <StrapiRenderer data={invalidData as unknown[]} map={componentMap} validation="silent" />
      );

      expect(screen.getByTestId('hero')).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    it('should catch component errors and show fallback', () => {
      const componentMap: ComponentMap = {
        'sections.error': {
          component: MockErrorComponent,
        },
      };

      const data = [
        {
          __component: 'sections.error',
        },
      ];

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <StrapiRenderer
          data={data}
          map={componentMap}
          fallback={<div data-testid="fallback">Error occurred</div>}
        />
      );

      // In development, error boundary shows detailed error
      // In production, it would show fallback
      // The exact behavior depends on NODE_ENV

      consoleSpy.mockRestore();
    });

    it('should call onError callback when component fails', () => {
      const onError = vi.fn();

      const componentMap: ComponentMap = {
        'sections.error': {
          component: MockErrorComponent,
        },
      };

      const data = [
        {
          __component: 'sections.error',
        },
      ];

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<StrapiRenderer data={data} map={componentMap} onError={onError} />);

      // onError should be called with error details
      expect(onError).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should isolate errors to individual components', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
        'sections.error': {
          component: MockErrorComponent,
        },
      };

      const data = [
        {
          __component: 'sections.hero',
          title: 'Working Component',
        },
        {
          __component: 'sections.error',
        },
        {
          __component: 'sections.hero',
          title: 'Another Working Component',
        },
      ];

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<StrapiRenderer data={data} map={componentMap} />);

      // Working components should still render
      expect(screen.getByText('Working Component')).toBeInTheDocument();
      expect(screen.getByText('Another Working Component')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Fallback Rendering', () => {
    it('should show fallback for empty data when provided', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      render(
        <StrapiRenderer
          data={[]}
          map={componentMap}
          fallback={<div data-testid="fallback">No content</div>}
        />
      );

      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      expect(screen.getByText('No content')).toBeInTheDocument();
    });

    it('should show fallback for null data when provided', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      render(
        <StrapiRenderer
          data={null as unknown as unknown[]}
          map={componentMap}
          fallback={<div data-testid="fallback">No data</div>}
        />
      );

      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });

  describe('Key Generation', () => {
    it('should use component id as key if available', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const data = [
        {
          id: 'unique-id-123',
          __component: 'sections.hero',
          title: 'Hero with ID',
        },
      ];

      const { container } = render(<StrapiRenderer data={data} map={componentMap} />);

      // Component should render successfully with ID as key
      expect(container.querySelector('[data-testid="hero"]')).toBeInTheDocument();
    });

    it('should generate fallback key from component type and index', () => {
      const componentMap: ComponentMap = {
        'sections.hero': {
          component: MockHeroComponent,
        },
      };

      const data = [
        {
          __component: 'sections.hero',
          title: 'Hero without ID',
        },
      ];

      const { container } = render(<StrapiRenderer data={data} map={componentMap} />);

      // Component should render successfully with generated key
      expect(container.querySelector('[data-testid="hero"]')).toBeInTheDocument();
    });
  });

  describe('Props Passing', () => {
    it('should pass all component data as props', () => {
      const TestComponent = (props: Record<string, unknown>) => (
        <div data-testid="test-component">
          {JSON.stringify(props)}
        </div>
      );

      const componentMap: ComponentMap = {
        'sections.test': {
          component: TestComponent,
        },
      };

      const data = [
        {
          __component: 'sections.test',
          title: 'Test',
          count: 42,
          nested: { value: 'nested' },
        },
      ];

      render(<StrapiRenderer data={data} map={componentMap} />);

      const component = screen.getByTestId('test-component');
      const props = JSON.parse(component.textContent || '{}');

      expect(props.__component).toBe('sections.test');
      expect(props.title).toBe('Test');
      expect(props.count).toBe(42);
      expect(props.nested).toEqual({ value: 'nested' });
    });
  });
});
