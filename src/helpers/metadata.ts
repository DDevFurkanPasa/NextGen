/**
 * SEO Metadata Helper - Phase 4 Implementation
 * Generates Next.js App Router metadata from Strapi SEO data
 */

import type { Metadata } from 'next';
import type { StrapiSEO } from '../types';

/**
 * Generates Next.js metadata from Strapi SEO data
 * 
 * Automatically handles:
 * - Title and description
 * - Open Graph tags (og:title, og:description, og:image, etc.)
 * - Twitter Card tags
 * - Canonical URLs
 * - Robots meta tags
 * - Keywords
 * 
 * @param seoData - Strapi SEO component data
 * @param defaults - Optional default metadata values
 * @returns Next.js Metadata object
 * 
 * @example
 * ```typescript
 * // In app/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   const page = await strapiClient.getPage(params.slug);
 *   return generateStrapiMetadata(page.data.attributes.seo, {
 *     metadataBase: new URL('https://example.com'),
 *   });
 * }
 * ```
 */
export function generateStrapiMetadata(
  seoData: StrapiSEO | null | undefined,
  defaults?: Partial<Metadata>
): Metadata {
  // If no SEO data provided, return defaults only
  if (!seoData) {
    return defaults || {};
  }

  const metadata: Metadata = {
    ...defaults,
  };

  // Basic metadata
  if (seoData.metaTitle) {
    metadata.title = seoData.metaTitle;
  }

  if (seoData.metaDescription) {
    metadata.description = seoData.metaDescription;
  }

  if (seoData.keywords) {
    metadata.keywords = seoData.keywords;
  }

  if (seoData.canonicalURL) {
    metadata.alternates = {
      ...metadata.alternates,
      canonical: seoData.canonicalURL,
    };
  }

  // Robots meta tag
  if (seoData.metaRobots) {
    metadata.robots = seoData.metaRobots;
  }

  // Open Graph metadata
  const ogImage = seoData.metaImage?.data?.attributes;
  const shareImage = seoData.metaSocial?.find((s) => s.socialNetwork === 'Facebook')?.image?.data?.attributes;
  const imageToUse = ogImage || shareImage;

  if (seoData.metaTitle || seoData.metaDescription || imageToUse) {
    metadata.openGraph = {
      ...metadata.openGraph,
      title: seoData.metaTitle || undefined,
      description: seoData.metaDescription || undefined,
      images: imageToUse
        ? [
            {
              url: imageToUse.url,
              width: imageToUse.width || undefined,
              height: imageToUse.height || undefined,
              alt: imageToUse.alternativeText || seoData.metaTitle || undefined,
            },
          ]
        : undefined,
    };
  }

  // Twitter Card metadata
  const twitterSocial = seoData.metaSocial?.find((s) => s.socialNetwork === 'Twitter');
  if (twitterSocial || seoData.metaTitle || seoData.metaDescription) {
    const twitterImage = twitterSocial?.image?.data?.attributes || imageToUse;

    metadata.twitter = {
      ...metadata.twitter,
      card: 'summary_large_image',
      title: twitterSocial?.title || seoData.metaTitle || undefined,
      description: twitterSocial?.description || seoData.metaDescription || undefined,
      images: twitterImage
        ? [
            {
              url: twitterImage.url,
              alt: twitterImage.alternativeText || seoData.metaTitle || undefined,
            },
          ]
        : undefined,
    };
  }

  // Structured data (if provided)
  if (seoData.structuredData) {
    try {
      const structuredData = typeof seoData.structuredData === 'string'
        ? JSON.parse(seoData.structuredData)
        : seoData.structuredData;

      // Note: Next.js metadata.other doesn't support nested objects well
      // Structured data should be added via a separate script tag in layout
      if (process.env.NODE_ENV === 'development') {
        console.log('[generateStrapiMetadata] Structured data available:', structuredData);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[generateStrapiMetadata] Invalid structured data:', error);
      }
    }
  }

  return metadata;
}
