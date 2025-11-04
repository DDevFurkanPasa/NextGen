/**
 * Strapi-NextGen Framework
 * A high-performance, type-safe framework bridging Strapi CMS and Next.js
 *
 * @packageDocumentation
 */

// Data Layer (SDK) - To be implemented in Phase 2
export { createStrapiSDK } from './sdk';
export { generateCacheTag, parseCacheTag } from './sdk/cache-tags';
export type { StrapiSDKConfig, StrapiSDK } from './sdk/types';

// Presentation Layer (Renderer) - To be implemented in Phase 3
export { StrapiRenderer } from './renderer';
export type { StrapiRendererProps, ComponentMap } from './renderer/types';

// Advanced Features - Phase 4
export { generateStrapiMetadata } from './helpers/metadata';
export { StrapiImage, type StrapiImageProps } from './components/StrapiImage';
export { createStrapiRevalidator, type RevalidatorConfig } from './revalidation';
export { createPreviewHandler, createExitPreviewHandler, type PreviewConfig } from './preview';

// Types
export type {
  StrapiResponse,
  StrapiEntity,
  StrapiCollection,
  StrapiMedia,
} from './types';

// Version
export const VERSION = '0.1.0';
