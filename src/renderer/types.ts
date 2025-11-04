/**
 * Renderer type definitions
 */

import type { ComponentType } from 'react';
import type { z } from 'zod';

/**
 * Component map entry with optional schema validation
 */
export interface ComponentMapEntry<T = unknown> {
  component: ComponentType<T>;
  schema?: z.ZodSchema<T>;
}

/**
 * Component map for dynamic zone rendering
 */
export type ComponentMap = Record<string, ComponentType<unknown> | ComponentMapEntry>;

/**
 * Props for StrapiRenderer component
 */
export interface StrapiRendererProps {
  /** Dynamic zone data from Strapi */
  data: Array<{
    __typename: string;
    [key: string]: unknown;
  }>;
  /** Map of Strapi component names to React components */
  map: ComponentMap;
  /** Optional fallback component for unknown types */
  fallback?: ComponentType<{ typename: string }>;
}
