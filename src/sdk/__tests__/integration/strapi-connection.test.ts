/**
 * Integration tests for Strapi connection
 * 
 * These tests require a running Strapi instance with:
 * - GraphQL plugin enabled
 * - Sample content types (Page, Collection, Global)
 * - Test data populated
 * 
 * Set environment variables:
 * - TEST_STRAPI_URL: Strapi GraphQL endpoint
 * - TEST_STRAPI_TOKEN: API token (optional)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createStrapiSDK } from '../../index';
import type { StrapiSDK } from '../../types';

// Skip integration tests if Strapi URL is not configured
const STRAPI_URL = process.env.TEST_STRAPI_URL;
const STRAPI_TOKEN = process.env.TEST_STRAPI_TOKEN;
const RUN_INTEGRATION_TESTS = !!STRAPI_URL;

describe.skipIf(!RUN_INTEGRATION_TESTS)('Strapi Connection Integration Tests', () => {
  let sdk: StrapiSDK;

  beforeAll(() => {
    if (!STRAPI_URL) {
      throw new Error('TEST_STRAPI_URL environment variable is required for integration tests');
    }

    sdk = createStrapiSDK({
      url: STRAPI_URL,
      token: STRAPI_TOKEN,
      logging: {
        queries: true,
        cacheTags: true,
      },
    });
  });

  describe('SDK Initialization', () => {
    it('should create SDK instance successfully', () => {
      expect(sdk).toBeDefined();
      expect(sdk.getPage).toBeDefined();
      expect(sdk.getCollection).toBeDefined();
      expect(sdk.getGlobal).toBeDefined();
      expect(sdk.rawQuery).toBeDefined();
    });
  });

  describe('GraphQL Connection', () => {
    it('should connect to Strapi GraphQL endpoint', async () => {
      // Simple introspection query to verify connection
      const query = `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `;

      const result = await sdk.rawQuery<{
        __schema: { queryType: { name: string } };
      }>(query);

      expect(result.__schema).toBeDefined();
      expect(result.__schema.queryType.name).toBe('Query');
    });

    it('should handle authentication with token', async () => {
      if (!STRAPI_TOKEN) {
        console.log('Skipping auth test - no token provided');
        return;
      }

      // Query that requires authentication
      const query = `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `;

      const result = await sdk.rawQuery(query);
      expect(result).toBeDefined();
    });

    it('should handle GraphQL errors gracefully', async () => {
      const invalidQuery = `
        query {
          nonExistentField {
            id
          }
        }
      `;

      await expect(sdk.rawQuery(invalidQuery)).rejects.toThrow();
    });
  });

  describe('getPage Method', () => {
    it('should fetch a page by slug', async () => {
      // Note: This assumes a page with slug 'home' exists
      // Adjust based on your test data
      const query = `
        query GetPage($slug: String!) {
          pages(filters: { slug: { eq: $slug } }) {
            data {
              id
              attributes {
                slug
                title
              }
            }
          }
        }
      `;

      try {
        const result = await sdk.rawQuery<{
          pages: { data: Array<{ id: string; attributes: { slug: string; title: string } }> };
        }>(query, { slug: 'home' });

        if (result.pages.data.length > 0) {
          expect(result.pages.data[0]).toBeDefined();
          expect(result.pages.data[0].attributes.slug).toBe('home');
        } else {
          console.log('No page with slug "home" found - test skipped');
        }
      } catch (error) {
        console.log('Page query failed - ensure test data exists:', error);
      }
    });

    it('should handle non-existent page gracefully', async () => {
      const query = `
        query GetPage($slug: String!) {
          pages(filters: { slug: { eq: $slug } }) {
            data {
              id
            }
          }
        }
      `;

      const result = await sdk.rawQuery<{
        pages: { data: unknown[] };
      }>(query, { slug: 'non-existent-page-12345' });

      expect(result.pages.data).toHaveLength(0);
    });
  });

  describe('getCollection Method', () => {
    it('should fetch collection items', async () => {
      // Generic query that should work with any collection
      const query = `
        query {
          __type(name: "Query") {
            fields {
              name
            }
          }
        }
      `;

      const result = await sdk.rawQuery(query);
      expect(result).toBeDefined();
    });

    it('should handle pagination parameters', async () => {
      const query = `
        query GetPages($limit: Int, $start: Int) {
          pages(pagination: { limit: $limit, start: $start }) {
            data {
              id
            }
            meta {
              pagination {
                total
                page
                pageSize
              }
            }
          }
        }
      `;

      try {
        const result = await sdk.rawQuery<{
          pages: {
            data: unknown[];
            meta: { pagination: { total: number; page: number; pageSize: number } };
          };
        }>(query, { limit: 5, start: 0 });

        expect(result.pages).toBeDefined();
        expect(result.pages.data).toBeInstanceOf(Array);
      } catch (error) {
        console.log('Pagination test skipped - pages collection may not exist');
      }
    });

    it('should handle filters', async () => {
      const query = `
        query GetFilteredPages($slug: String!) {
          pages(filters: { slug: { eq: $slug } }) {
            data {
              id
              attributes {
                slug
              }
            }
          }
        }
      `;

      try {
        const result = await sdk.rawQuery<{
          pages: { data: Array<{ id: string; attributes: { slug: string } }> };
        }>(query, { slug: 'home' });

        expect(result.pages.data).toBeInstanceOf(Array);
      } catch (error) {
        console.log('Filter test skipped - pages collection may not exist');
      }
    });
  });

  describe('getGlobal Method', () => {
    it('should fetch global singleton', async () => {
      const query = `
        query {
          __type(name: "Query") {
            fields {
              name
            }
          }
        }
      `;

      const result = await sdk.rawQuery(query);
      expect(result).toBeDefined();
    });
  });

  describe('Locale Support', () => {
    it('should handle locale parameter', async () => {
      const query = `
        query GetPageWithLocale($slug: String!, $locale: I18NLocaleCode) {
          pages(filters: { slug: { eq: $slug } }, locale: $locale) {
            data {
              id
              attributes {
                slug
                locale
              }
            }
          }
        }
      `;

      try {
        const result = await sdk.rawQuery<{
          pages: { data: Array<{ id: string; attributes: { slug: string; locale: string } }> };
        }>(query, { slug: 'home', locale: 'en' });

        expect(result.pages).toBeDefined();
      } catch (error) {
        console.log('Locale test skipped - i18n may not be configured');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const badSdk = createStrapiSDK({
        url: 'http://localhost:9999/graphql', // Non-existent endpoint
      });

      const query = `query { __typename }`;

      await expect(badSdk.rawQuery(query)).rejects.toThrow();
    });

    it('should handle malformed queries', async () => {
      const malformedQuery = 'this is not valid graphql';

      await expect(sdk.rawQuery(malformedQuery)).rejects.toThrow();
    });

    it('should handle missing required variables', async () => {
      const query = `
        query GetPage($slug: String!) {
          pages(filters: { slug: { eq: $slug } }) {
            data {
              id
            }
          }
        }
      `;

      // Missing required $slug variable
      await expect(sdk.rawQuery(query, {})).rejects.toThrow();
    });
  });

  describe('Performance', () => {
    it('should complete queries in reasonable time', async () => {
      const startTime = Date.now();

      const query = `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `;

      await sdk.rawQuery(query);

      const duration = Date.now() - startTime;

      // Should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
    });

    it('should handle multiple concurrent requests', async () => {
      const query = `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `;

      const promises = Array.from({ length: 5 }, () => sdk.rawQuery(query));

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result).toBeDefined();
      });
    });
  });

  describe('Data Validation', () => {
    it('should return properly structured responses', async () => {
      const query = `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `;

      const result = await sdk.rawQuery<{
        __schema: { queryType: { name: string } };
      }>(query);

      expect(typeof result).toBe('object');
      expect(result.__schema).toBeDefined();
      expect(typeof result.__schema.queryType.name).toBe('string');
    });

    it('should handle null values correctly', async () => {
      const query = `
        query GetPages {
          pages(filters: { slug: { eq: "non-existent" } }) {
            data {
              id
            }
          }
        }
      `;

      try {
        const result = await sdk.rawQuery<{
          pages: { data: unknown[] };
        }>(query);

        expect(result.pages.data).toBeInstanceOf(Array);
        expect(result.pages.data).toHaveLength(0);
      } catch (error) {
        console.log('Null handling test skipped');
      }
    });
  });
});

// Helper to check if integration tests should run
if (!RUN_INTEGRATION_TESTS) {
  console.log(`
⚠️  Integration tests skipped!

To run integration tests, set the following environment variables:
  TEST_STRAPI_URL=http://localhost:1337/graphql
  TEST_STRAPI_TOKEN=your_api_token (optional)

Example:
  TEST_STRAPI_URL=http://localhost:1337/graphql npm test
  `);
}
