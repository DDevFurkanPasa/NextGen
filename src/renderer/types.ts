/**
 * Renderer type definitions
 */

import type { ComponentType, ReactNode } from 'react';
import type { ErrorInfo } from 'react';
import type { ZodSchema } from 'zod';

/**
 * Component map entry with optional schema validation
 */
export interface ComponentMapEntry {
  /** React component to render */
  component: ComponentType<unknown>;
  /** Optional Zod schema for runtime validation */
  schema?: ZodSchema;
}

/**
 * Component map: Strapi component type -> React component
 */
export type ComponentMap = Record<string, ComponentMapEntry>;

/**
 * Props for StrapiRenderer component
 */
export interface StrapiRendererProps {
  /** Array of Strapi components to render (from dynamic zones) */
  data: unknown[];
  /** Component map */
  map: ComponentMap;
  /** Validation mode (default: 'error' in dev, 'silent' in prod) */
  validation?: 'error' | 'warn' | 'silent';
  /** Fallback UI for errors */
  fallback?: ReactNode;
  /** Error callback */
  onError?: (error: Error, errorInfo: ErrorInfo, componentType: string) => void;
}
