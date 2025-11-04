/**
 * Zod validation utilities for component data
 * Provides runtime type safety for Strapi component data
 */

import type { ZodSchema } from 'zod';

export interface ValidationResult {
  success: boolean;
  error?: unknown;
}

/**
 * Validates component data against a Zod schema
 * 
 * @param data - Component data to validate
 * @param schema - Zod schema to validate against
 * @param componentType - Component type name (for logging)
 * @param mode - Validation mode ('error' | 'warn' | 'silent')
 * @returns Validation result
 */
export function validateComponentData(
  data: unknown,
  schema: ZodSchema,
  componentType: string,
  mode: 'error' | 'warn' | 'silent'
): ValidationResult {
  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    // Handle validation failure based on mode
    if (mode === 'error') {
      console.error(
        `[StrapiRenderer] Validation failed for component: ${componentType}`,
        '\nData:', data,
        '\nError:', error
      );
    } else if (mode === 'warn') {
      console.warn(
        `[StrapiRenderer] Validation warning for component: ${componentType}`,
        '\nData:', data,
        '\nError:', error
      );
    }

    return {
      success: false,
      error,
    };
  }
}

/**
 * Type guard to check if data has __component field
 */
export function hasStrapiComponent(
  data: unknown
): data is { __component: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    '__component' in data &&
    typeof (data as { __component: unknown }).__component === 'string'
  );
}
