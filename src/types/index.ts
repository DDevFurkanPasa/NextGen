/**
 * Core Strapi response types
 * These types represent the standard Strapi v4 API response structure
 */

/**
 * Standard Strapi API response wrapper
 */
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Single Strapi entity structure
 */
export interface StrapiEntity<T = Record<string, unknown>> {
  id: number;
  attributes: T & {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    locale?: string;
  };
}

/**
 * Collection of Strapi entities
 */
export type StrapiCollection<T = Record<string, unknown>> = StrapiEntity<T>[];

/**
 * Strapi media/file structure
 */
export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText?: string;
      caption?: string;
      width: number;
      height: number;
      formats?: {
        thumbnail?: MediaFormat;
        small?: MediaFormat;
        medium?: MediaFormat;
        large?: MediaFormat;
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl?: string;
      provider: string;
      createdAt: string;
      updatedAt: string;
    };
  } | null;
}

/**
 * Media format structure
 */
export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

/**
 * Strapi SEO Social Media
 */
export interface StrapiSEOSocial {
  socialNetwork: 'Facebook' | 'Twitter';
  title?: string;
  description?: string;
  image?: StrapiMedia;
}

/**
 * Strapi SEO component
 */
export interface StrapiSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: StrapiMedia;
  keywords?: string;
  metaRobots?: string;
  structuredData?: Record<string, unknown>;
  metaViewport?: string;
  canonicalURL?: string;
  metaSocial?: StrapiSEOSocial[];
}
