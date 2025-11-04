/**
 * Strapi Image Component - Phase 4 Implementation
 * Optimized image component with next/image integration
 */

import Image, { type ImageProps } from 'next/image';
import type { StrapiMedia } from '../types';

/**
 * Props for StrapiImage component
 */
export interface StrapiImageProps {
  /** Strapi media object */
  data: StrapiMedia;
  /** Additional props to pass to next/image */
  nextImageProps?: Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>;
  /** Fallback image URL if Strapi image is missing */
  fallback?: string;
}

/**
 * Optimized image component for Strapi media
 * 
 * Features:
 * - Automatic responsive image handling
 * - Strapi image format support (thumbnail, small, medium, large)
 * - next/image integration with automatic width/height
 * - Fallback support for missing images
 * - Alt text from Strapi alternativeText field
 * 
 * @example
 * ```tsx
 * <StrapiImage 
 *   data={page.attributes.hero.image}
 *   nextImageProps={{ 
 *     priority: true,
 *     className: 'rounded-lg',
 *     fill: true,
 *   }}
 * />
 * ```
 */
export function StrapiImage(props: StrapiImageProps): React.ReactElement | null {
  const { data, nextImageProps, fallback } = props;

  // Handle missing or invalid data
  if (!data?.data?.attributes) {
    if (fallback) {
      return (
        <Image
          src={fallback}
          alt="Fallback image"
          {...nextImageProps}
        />
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn('[StrapiImage] No image data provided');
    }

    return null;
  }

  const imageData = data.data.attributes;

  // Extract image properties
  const src = imageData.url;
  const alt = imageData.alternativeText || imageData.name || '';
  const width = imageData.width;
  const height = imageData.height;

  // If fill mode is used, don't pass width/height
  if (nextImageProps?.fill) {
    return (
      <Image
        src={src}
        alt={alt}
        {...nextImageProps}
      />
    );
  }

  // Standard mode with width/height
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...nextImageProps}
    />
  );
}
