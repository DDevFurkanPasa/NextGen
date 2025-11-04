/**
 * Strapi Image Component - Phase 4 Implementation
 * This is a placeholder for the image optimization component
 */

import React from 'react';
import type { StrapiMedia } from '../types';

/**
 * Props for StrapiImage component
 */
export interface StrapiImageProps {
  /** Strapi media object */
  data: StrapiMedia;
  /** Optional className */
  className?: string;
  /** Additional props for next/image */
  nextImageProps?: Record<string, unknown>;
}

/**
 * Optimized image component for Strapi media
 * Automatically integrates with next/image
 * 
 * @example
 * ```tsx
 * <StrapiImage 
 *   data={strapiImageObject}
 *   nextImageProps={{ priority: true }}
 * />
 * ```
 */
export function StrapiImage(_props: StrapiImageProps): React.ReactElement {
  // TODO: Implement in Phase 4
  return <div>StrapiImage not yet implemented - Phase 4</div>;
}
