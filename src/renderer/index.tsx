/**
 * Presentation Layer (Renderer) - Phase 3 Implementation
 * Renders Strapi dynamic zones with Error Boundaries and Zod validation
 */

import React from 'react';
import type { StrapiRendererProps } from './types';
import { ComponentErrorBoundary } from './error-boundary';
import { validateComponentData } from './validator';

/**
 * Renders Strapi dynamic zones with automatic component mapping
 * 
 * Features:
 * - Automatic Error Boundary wrapping for each component
 * - Optional Zod validation in development mode
 * - Graceful degradation in production
 * - Type-safe component mapping
 * 
 * @param props - Renderer configuration
 * 
 * @example
 * ```tsx
 * <StrapiRenderer 
 *   data={dynamicZoneData} 
 *   map={componentMap}
 *   validation="warn"
 * />
 * ```
 */
export function StrapiRenderer(props: StrapiRendererProps): React.ReactElement {
  const {
    data,
    map,
    validation = process.env.NODE_ENV === 'development' ? 'error' : 'silent',
    fallback,
    onError,
  } = props;

  // Handle empty or invalid data
  if (!data || !Array.isArray(data)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[StrapiRenderer] Invalid data prop: expected array, got:', typeof data);
    }
    return fallback ? <>{fallback}</> : <></>;
  }

  // Handle empty array
  if (data.length === 0) {
    return fallback ? <>{fallback}</> : <></>;
  }

  return (
    <>
      {data.map((item, index) => {
        // Type guard: ensure item is an object
        if (typeof item !== 'object' || item === null) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[StrapiRenderer] Invalid component data:', item);
          }
          return null;
        }

        const component = item as Record<string, unknown>;

        // Extract component type from __component field
        const componentType = component.__component;
        
        if (typeof componentType !== 'string') {
          if (process.env.NODE_ENV === 'development') {
            console.error('[StrapiRenderer] Component missing __component field:', component);
          }
          return null;
        }

        // Look up component in map
        const mapEntry = map[componentType];
        
        if (!mapEntry) {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              `[StrapiRenderer] No component mapped for type: ${componentType}`,
              '\nAvailable mappings:', Object.keys(map)
            );
          }
          return null;
        }

        const { component: Component, schema } = mapEntry;

        // Validate component data with Zod schema (if provided)
        if (schema && validation !== 'silent') {
          const validationResult = validateComponentData(
            component,
            schema,
            componentType,
            validation
          );

          // If validation failed and mode is 'error', skip rendering
          if (!validationResult.success && validation === 'error') {
            return null;
          }
        }

        // Generate unique key for component
        const componentId = component.id;
        const key = (typeof componentId === 'string' || typeof componentId === 'number')
          ? componentId
          : `${componentType}-${index}`;

        // Render component wrapped in Error Boundary
        return (
          <ComponentErrorBoundary
            key={key}
            componentType={componentType}
            onError={onError}
            fallback={fallback}
          >
            <Component {...component} />
          </ComponentErrorBoundary>
        );
      })}
    </>
  );
}
