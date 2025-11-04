/**
 * Metadata Helper Tests
 * Target: 90%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateStrapiMetadata } from '../metadata';
import type { StrapiSEO } from '../../types';

describe('generateStrapiMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Null and undefined handling', () => {
    it('should handle null seoData input', () => {
      const result = generateStrapiMetadata(null);
      expect(result).toEqual({});
    });

    it('should handle undefined seoData input', () => {
      const result = generateStrapiMetadata(undefined);
      expect(result).toEqual({});
    });

    it('should return defaults when seoData is null', () => {
      const defaults = {
        title: 'Default Title',
        description: 'Default Description',
      };
      const result = generateStrapiMetadata(null, defaults);
      expect(result).toEqual(defaults);
    });

    it('should return defaults when seoData is undefined', () => {
      const defaults = {
        metadataBase: new URL('https://example.com'),
      };
      const result = generateStrapiMetadata(undefined, defaults);
      expect(result).toEqual(defaults);
    });
  });

  describe('Basic metadata mapping', () => {
    it('should correctly map metaTitle', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Test Page Title',
      };
      const result = generateStrapiMetadata(seoData);
      expect(result.title).toBe('Test Page Title');
    });

    it('should correctly map metaDescription', () => {
      const seoData: StrapiSEO = {
        metaDescription: 'Test page description for SEO',
      };
      const result = generateStrapiMetadata(seoData);
      expect(result.description).toBe('Test page description for SEO');
    });

    it('should correctly map keywords', () => {
      const seoData: StrapiSEO = {
        keywords: 'test, seo, keywords',
      };
      const result = generateStrapiMetadata(seoData);
      expect(result.keywords).toBe('test, seo, keywords');
    });

    it('should correctly map canonicalURL', () => {
      const seoData: StrapiSEO = {
        canonicalURL: 'https://example.com/canonical',
      };
      const result = generateStrapiMetadata(seoData);
      expect(result.alternates?.canonical).toBe('https://example.com/canonical');
    });

    it('should correctly map metaRobots', () => {
      const seoData: StrapiSEO = {
        metaRobots: 'index, follow',
      };
      const result = generateStrapiMetadata(seoData);
      expect(result.robots).toBe('index, follow');
    });

    it('should correctly map all basic fields together', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Complete Test',
        metaDescription: 'Complete description',
        keywords: 'complete, test',
        canonicalURL: 'https://example.com/complete',
        metaRobots: 'noindex, nofollow',
      };
      const result = generateStrapiMetadata(seoData);
      
      expect(result.title).toBe('Complete Test');
      expect(result.description).toBe('Complete description');
      expect(result.keywords).toBe('complete, test');
      expect(result.alternates?.canonical).toBe('https://example.com/complete');
      expect(result.robots).toBe('noindex, nofollow');
    });
  });

  describe('Defaults merging', () => {
    it('should merge metadataBase correctly', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Test Title',
      };
      const defaults = {
        metadataBase: new URL('https://example.com'),
      };
      const result = generateStrapiMetadata(seoData, defaults);
      
      expect(result.metadataBase).toEqual(new URL('https://example.com'));
      expect(result.title).toBe('Test Title');
    });

    it('should merge default title with Strapi title', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Page Title',
      };
      const defaults = {
        title: {
          template: '%s | Site Name',
          default: 'Site Name',
        },
      };
      const result = generateStrapiMetadata(seoData, defaults);
      
      // Strapi title should override
      expect(result.title).toBe('Page Title');
    });

    it('should preserve defaults when Strapi fields are empty', () => {
      const seoData: StrapiSEO = {};
      const defaults = {
        title: 'Default Title',
        description: 'Default Description',
        keywords: 'default, keywords',
      };
      const result = generateStrapiMetadata(seoData, defaults);
      
      expect(result.title).toBe('Default Title');
      expect(result.description).toBe('Default Description');
      expect(result.keywords).toBe('default, keywords');
    });
  });

  describe('Open Graph metadata', () => {
    it('should correctly map Open Graph with metaImage', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'OG Title',
        metaDescription: 'OG Description',
        metaImage: {
          data: {
            id: 1,
            attributes: {
              name: 'og-image.jpg',
              url: '/uploads/og-image.jpg',
              width: 1200,
              height: 630,
              alternativeText: 'OG Image Alt',
              hash: 'og_hash',
              ext: '.jpg',
              mime: 'image/jpeg',
              size: 150,
              provider: 'local',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          },
        },
      };
      const result = generateStrapiMetadata(seoData);
      
      expect(result.openGraph?.title).toBe('OG Title');
      expect(result.openGraph?.description).toBe('OG Description');
      expect(result.openGraph?.images).toEqual([
        {
          url: '/uploads/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'OG Image Alt',
        },
      ]);
    });

    it('should use metaTitle as fallback for OG image alt', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Fallback Alt Text',
        metaImage: {
          data: {
            id: 1,
            attributes: {
              name: 'image.jpg',
              url: '/uploads/image.jpg',
              width: 1200,
              height: 630,
              hash: 'hash',
              ext: '.jpg',
              mime: 'image/jpeg',
              size: 100,
              provider: 'local',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          },
        },
      };
      const result = generateStrapiMetadata(seoData);
      
      const images = Array.isArray(result.openGraph?.images) ? result.openGraph.images : [];
      expect(images[0]?.alt).toBe('Fallback Alt Text');
    });

    it('should use Facebook metaSocial image if metaImage is missing', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Test',
        metaSocial: [
          {
            socialNetwork: 'Facebook',
            title: 'FB Title',
            description: 'FB Description',
            image: {
              data: {
                id: 2,
                attributes: {
                  name: 'fb-image.jpg',
                  url: '/uploads/fb-image.jpg',
                  width: 1200,
                  height: 630,
                  hash: 'fb_hash',
                  ext: '.jpg',
                  mime: 'image/jpeg',
                  size: 120,
                  provider: 'local',
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updatedAt: '2024-01-01T00:00:00.000Z',
                },
              },
            },
          },
        ],
      };
      const result = generateStrapiMetadata(seoData);
      
      const images = Array.isArray(result.openGraph?.images) ? result.openGraph.images : [];
      expect(images[0]?.url).toBe('/uploads/fb-image.jpg');
    });

    it('should handle metaImage with null data', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Test',
        metaImage: {
          data: null,
        },
      };
      const result = generateStrapiMetadata(seoData);
      
      expect(result.openGraph?.images).toBeUndefined();
    });

    it('should merge with existing openGraph in defaults', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'New Title',
      };
      const defaults = {
        openGraph: {
          type: 'website' as const,
          siteName: 'My Site',
        },
      };
      const result = generateStrapiMetadata(seoData, defaults);
      
      expect(result.openGraph?.title).toBe('New Title');
      expect((result.openGraph as any)?.type).toBe('website');
      expect((result.openGraph as any)?.siteName).toBe('My Site');
    });
  });

  describe('Twitter Card metadata', () => {
    it('should correctly map Twitter Card with metaSocial', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Default Title',
        metaSocial: [
          {
            socialNetwork: 'Twitter',
            title: 'Twitter Title',
            description: 'Twitter Description',
            image: {
              data: {
                id: 3,
                attributes: {
                  name: 'twitter-image.jpg',
                  url: '/uploads/twitter-image.jpg',
                  width: 1200,
                  height: 600,
                  alternativeText: 'Twitter Image',
                  hash: 'twitter_hash',
                  ext: '.jpg',
                  mime: 'image/jpeg',
                  size: 110,
                  provider: 'local',
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updatedAt: '2024-01-01T00:00:00.000Z',
                },
              },
            },
          },
        ],
      };
      const result = generateStrapiMetadata(seoData);
      
      expect((result.twitter as any)?.card).toBe('summary_large_image');
      expect(result.twitter?.title).toBe('Twitter Title');
      expect(result.twitter?.description).toBe('Twitter Description');
      const twitterImages = Array.isArray(result.twitter?.images) ? result.twitter.images : [];
      expect(twitterImages[0]?.url).toBe('/uploads/twitter-image.jpg');
      expect(twitterImages[0]?.alt).toBe('Twitter Image');
    });

    it('should fallback to metaTitle for Twitter when no Twitter social data', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Meta Title',
        metaDescription: 'Meta Description',
      };
      const result = generateStrapiMetadata(seoData);
      
      expect(result.twitter?.title).toBe('Meta Title');
      expect(result.twitter?.description).toBe('Meta Description');
    });

    it('should use OG image for Twitter if Twitter image missing', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Test',
        metaImage: {
          data: {
            id: 1,
            attributes: {
              name: 'og-image.jpg',
              url: '/uploads/og-image.jpg',
              width: 1200,
              height: 630,
              hash: 'og_hash',
              ext: '.jpg',
              mime: 'image/jpeg',
              size: 100,
              provider: 'local',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        metaSocial: [
          {
            socialNetwork: 'Twitter',
            title: 'Twitter Title',
          },
        ],
      };
      const result = generateStrapiMetadata(seoData);
      
      const images = Array.isArray(result.twitter?.images) ? result.twitter.images : [];
      expect(images[0]?.url).toBe('/uploads/og-image.jpg');
    });

    it('should merge with existing twitter in defaults', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Title',
      };
      const defaults = {
        twitter: {
          site: '@mysite',
          creator: '@creator',
        },
      };
      const result = generateStrapiMetadata(seoData, defaults);
      
      expect(result.twitter?.title).toBe('Title');
      expect(result.twitter?.site).toBe('@mysite');
      expect(result.twitter?.creator).toBe('@creator');
    });
  });

  describe('Structured data handling', () => {
    let consoleLogSpy: any;
    let consoleErrorSpy: any;

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should log structured data in development mode (object)', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const seoData: StrapiSEO = {
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article',
        },
      };
      generateStrapiMetadata(seoData);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[generateStrapiMetadata] Structured data available:',
        { '@context': 'https://schema.org', '@type': 'Article' }
      );

      vi.unstubAllEnvs();
    });

    it('should parse structured data from JSON string', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const seoData: StrapiSEO = {
        structuredData: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
        }),
      };
      generateStrapiMetadata(seoData);
      
      expect(consoleLogSpy).toHaveBeenCalled();

      vi.unstubAllEnvs();
    });

    it('should handle invalid JSON in structured data', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const seoData: StrapiSEO = {
        structuredData: 'invalid json {' as any,
      };
      generateStrapiMetadata(seoData);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[generateStrapiMetadata] Invalid structured data:',
        expect.any(Error)
      );

      vi.unstubAllEnvs();
    });

    it('should not log in production mode', () => {
      vi.stubEnv('NODE_ENV', 'production');

      const seoData: StrapiSEO = {
        structuredData: { '@type': 'Article' },
      };
      generateStrapiMetadata(seoData);
      
      expect(consoleLogSpy).not.toHaveBeenCalled();

      vi.unstubAllEnvs();
    });
  });

  describe('Complex real-world scenarios', () => {
    it('should handle complete SEO data with all fields', () => {
      const seoData: StrapiSEO = {
        metaTitle: 'Complete Page | Site Name',
        metaDescription: 'A complete description for SEO and social sharing',
        keywords: 'seo, metadata, strapi, nextjs',
        canonicalURL: 'https://example.com/complete-page',
        metaRobots: 'index, follow, max-image-preview:large',
        metaImage: {
          data: {
            id: 1,
            attributes: {
              name: 'social-share.jpg',
              url: '/uploads/social-share.jpg',
              width: 1200,
              height: 630,
              alternativeText: 'Social Share Image',
              hash: 'social_hash',
              ext: '.jpg',
              mime: 'image/jpeg',
              size: 200,
              provider: 'local',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        metaSocial: [
          {
            socialNetwork: 'Facebook',
            title: 'Facebook Custom Title',
            description: 'Facebook custom description',
          },
          {
            socialNetwork: 'Twitter',
            title: 'Twitter Custom Title',
            description: 'Twitter custom description',
          },
        ],
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Complete Page',
        },
      };
      
      const defaults = {
        metadataBase: new URL('https://example.com'),
      };
      
      const result = generateStrapiMetadata(seoData, defaults);
      
      // Basic fields
      expect(result.title).toBe('Complete Page | Site Name');
      expect(result.description).toBe('A complete description for SEO and social sharing');
      expect(result.keywords).toBe('seo, metadata, strapi, nextjs');
      expect(result.robots).toBe('index, follow, max-image-preview:large');
      expect(result.alternates?.canonical).toBe('https://example.com/complete-page');
      
      // Open Graph
      expect(result.openGraph?.title).toBe('Complete Page | Site Name');
      expect(result.openGraph?.description).toBe('A complete description for SEO and social sharing');
      const ogImages = Array.isArray(result.openGraph?.images) ? result.openGraph.images : [];
      expect(ogImages[0]?.url).toBe('/uploads/social-share.jpg');
      
      // Twitter
      expect((result.twitter as any)?.card).toBe('summary_large_image');
      expect(result.twitter?.title).toBe('Twitter Custom Title');
      expect(result.twitter?.description).toBe('Twitter custom description');
      
      // Defaults preserved
      expect(result.metadataBase).toEqual(new URL('https://example.com'));
    });

    it('should handle empty SEO object with only defaults', () => {
      const seoData: StrapiSEO = {};
      const defaults = {
        title: 'Default Site Title',
        description: 'Default site description',
        metadataBase: new URL('https://example.com'),
        openGraph: {
          type: 'website' as const,
          siteName: 'My Website',
        },
      };
      
      const result = generateStrapiMetadata(seoData, defaults);
      
      expect(result).toEqual(defaults);
    });
  });
});
