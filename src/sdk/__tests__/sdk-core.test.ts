/**
 * SDK Core Tests
 * Target: 80%+ coverage for sdk/index.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStrapiSDK } from '../index';
import type { StrapiSDKConfig } from '../types';

// Mock dependencies
vi.mock('graphql-request', () => ({
  GraphQLClient: vi.fn().mockImplementation(() => ({
    request: vi.fn(),
  })),
}));

vi.mock('../fetch-wrapper', () => ({
  createCacheTaggedFetch: vi.fn(() => vi.fn()),
}));

vi.mock('../cache-tags', () => ({
  generateCacheTag: vi.fn((type, id, locale) => `strapi_${type}_${id}${locale ? `_${locale}` : ''}`),
}));

vi.mock('next/headers', () => ({
  draftMode: vi.fn(() => ({
    isEnabled: false,
  })),
}));

import { GraphQLClient } from 'graphql-request';
import { createCacheTaggedFetch } from '../fetch-wrapper';
import { generateCacheTag } from '../cache-tags';
import { draftMode } from 'next/headers';

describe('createStrapiSDK', () => {
  let consoleLogSpy: any;
  let mockRequest: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockRequest = vi.fn();
    vi.mocked(GraphQLClient).mockImplementation(() => ({
      request: mockRequest,
    } as any));
  });

  describe('Initialization', () => {
    it('should initialize correctly with valid configuration', () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
        token: 'test-token',
      };

      const sdk = createStrapiSDK(config);

      expect(sdk).toBeDefined();
      expect(sdk.getPage).toBeDefined();
      expect(sdk.getCollection).toBeDefined();
      expect(sdk.getGlobal).toBeDefined();
      expect(sdk.rawQuery).toBeDefined();
      expect(GraphQLClient).toHaveBeenCalledWith(
        'http://localhost:1337/graphql',
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer test-token',
          },
        })
      );
    });

    it('should initialize without token', () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      const sdk = createStrapiSDK(config);

      expect(sdk).toBeDefined();
      expect(GraphQLClient).toHaveBeenCalledWith(
        'http://localhost:1337/graphql',
        expect.objectContaining({
          headers: {},
        })
      );
    });

    it('should throw error when URL is missing', () => {
      const config = {} as StrapiSDKConfig;

      expect(() => createStrapiSDK(config)).toThrow('Strapi URL is required in SDK configuration');
    });

    it('should call createCacheTaggedFetch with logging option', () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
        logging: { queries: true },
      };

      createStrapiSDK(config);

      expect(createCacheTaggedFetch).toHaveBeenCalledWith({ queries: true });
    });
  });

  describe('getPage', () => {
    it('should call GraphQL client with correct tags and publicationState: LIVE', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        pages: {
          data: [{ id: '1', attributes: { title: 'Test Page' } }],
        },
      });

      const sdk = createStrapiSDK(config);
      const result = await sdk.getPage('test-slug');

      expect(generateCacheTag).toHaveBeenCalledWith('page', 'test-slug', undefined);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.stringContaining('query GetPage'),
        expect.objectContaining({
          slug: 'test-slug',
        })
      );
      expect(result).toEqual({ id: '1', attributes: { title: 'Test Page' } });
    });

    it('should call with publicationState: PREVIEW when Draft Mode active', async () => {
      vi.mocked(draftMode).mockReturnValue({ isEnabled: true } as any);

      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        pages: {
          data: [{ id: '1', attributes: { title: 'Draft Page' } }],
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getPage('draft-slug');

      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          publicationState: 'PREVIEW',
          slug: 'draft-slug',
        })
      );
    });

    it('should pass locale parameter correctly', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        pages: {
          data: [{ id: '1', attributes: { title: 'French Page' } }],
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getPage('test-slug', { locale: 'fr' });

      expect(generateCacheTag).toHaveBeenCalledWith('page', 'test-slug', 'fr');
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          slug: 'test-slug',
          locale: 'fr',
        })
      );
    });

    it('should throw error when page not found', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        pages: {
          data: [],
        },
      });

      const sdk = createStrapiSDK(config);

      await expect(sdk.getPage('nonexistent')).rejects.toThrow('Page not found: nonexistent');
    });

    it('should log query when logging is enabled', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
        logging: { queries: true },
      };

      mockRequest.mockResolvedValue({
        pages: {
          data: [{ id: '1', attributes: {} }],
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getPage('test-slug', { locale: 'en' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Strapi SDK] getPage: test-slug',
        expect.objectContaining({
          tag: 'strapi_page_test-slug_en',
          options: { locale: 'en' },
        })
      );
    });
  });

  describe('getCollection', () => {
    it('should operate correctly with filters and pagination', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        blogPosts: {
          data: [
            { id: '1', attributes: { title: 'Post 1' } },
            { id: '2', attributes: { title: 'Post 2' } },
          ],
        },
      });

      const sdk = createStrapiSDK(config);
      const result = await sdk.getCollection('blogPosts', {
        filters: { published: true },
        pagination: { page: 1, pageSize: 10 },
        sort: ['publishedAt:desc'],
      });

      expect(generateCacheTag).toHaveBeenCalledWith('collection', 'blogPosts', undefined);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.stringContaining('query GetCollection'),
        expect.objectContaining({
          filters: { published: true },
          pagination: { page: 1, pageSize: 10 },
          sort: ['publishedAt:desc'],
        })
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', attributes: { title: 'Post 1' } });
    });

    it('should pass locale parameter correctly', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        articles: {
          data: [{ id: '1', attributes: {} }],
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getCollection('articles', { locale: 'fr' });

      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          locale: 'fr',
        })
      );
    });

    it('should return empty array when collection is empty', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        emptyCollection: {
          data: [],
        },
      });

      const sdk = createStrapiSDK(config);
      const result = await sdk.getCollection('emptyCollection');

      expect(result).toEqual([]);
    });

    it('should return empty array when collection data is null', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        nullCollection: null,
      });

      const sdk = createStrapiSDK(config);
      const result = await sdk.getCollection('nullCollection');

      expect(result).toEqual([]);
    });

    it('should log query when logging is enabled', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
        logging: { queries: true },
      };

      mockRequest.mockResolvedValue({
        posts: {
          data: [],
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getCollection('posts');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Strapi SDK] getCollection: posts',
        expect.any(Object)
      );
    });

    it('should include publicationState PREVIEW in draft mode', async () => {
      vi.mocked(draftMode).mockReturnValue({ isEnabled: true } as any);

      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        drafts: {
          data: [],
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getCollection('drafts');

      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          publicationState: 'PREVIEW',
        })
      );
    });
  });

  describe('getGlobal', () => {
    it('should operate correctly for singleton data', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        navigation: {
          data: { id: '1', attributes: { items: [] } },
        },
      });

      const sdk = createStrapiSDK(config);
      const result = await sdk.getGlobal('navigation');

      expect(generateCacheTag).toHaveBeenCalledWith('global', 'navigation', undefined);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.stringContaining('query GetGlobal'),
        expect.any(Object)
      );
      expect(result).toEqual({ id: '1', attributes: { items: [] } });
    });

    it('should pass locale parameter correctly', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        footer: {
          data: { id: '1', attributes: {} },
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getGlobal('footer', { locale: 'de' });

      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          locale: 'de',
        })
      );
    });

    it('should throw error when global not found', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({});

      const sdk = createStrapiSDK(config);

      await expect(sdk.getGlobal('nonexistent')).rejects.toThrow('Global not found: nonexistent');
    });

    it('should log query when logging is enabled', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
        logging: { queries: true },
      };

      mockRequest.mockResolvedValue({
        settings: {
          data: { id: '1', attributes: {} },
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getGlobal('settings');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Strapi SDK] getGlobal: settings',
        expect.any(Object)
      );
    });

    it('should include publicationState PREVIEW in draft mode', async () => {
      vi.mocked(draftMode).mockReturnValue({ isEnabled: true } as any);

      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        header: {
          data: { id: '1', attributes: {} },
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getGlobal('header');

      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          publicationState: 'PREVIEW',
        })
      );
    });
  });

  describe('rawQuery', () => {
    it('should execute custom GraphQL query', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      const customQuery = `
        query CustomQuery($id: ID!) {
          page(id: $id) {
            data {
              id
              attributes {
                title
              }
            }
          }
        }
      `;

      const expectedResult = {
        page: {
          data: { id: '1', attributes: { title: 'Custom' } },
        },
      };

      mockRequest.mockResolvedValue(expectedResult);

      const sdk = createStrapiSDK(config);
      const result = await sdk.rawQuery(customQuery, { id: '1' });

      expect(mockRequest).toHaveBeenCalledWith(customQuery, { id: '1' });
      expect(result).toEqual(expectedResult);
    });

    it('should work without variables', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      const simpleQuery = `{ pages { data { id } } }`;
      mockRequest.mockResolvedValue({ pages: { data: [] } });

      const sdk = createStrapiSDK(config);
      await sdk.rawQuery(simpleQuery);

      expect(mockRequest).toHaveBeenCalledWith(simpleQuery, undefined);
    });

    it('should log query when logging is enabled', async () => {
      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
        logging: { queries: true },
      };

      const query = `{ test }`;
      const variables = { foo: 'bar' };
      mockRequest.mockResolvedValue({});

      const sdk = createStrapiSDK(config);
      await sdk.rawQuery(query, variables);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Strapi SDK] rawQuery',
        { query, variables }
      );
    });
  });

  describe('Draft mode handling', () => {
    it('should handle draft mode unavailable gracefully', async () => {
      vi.mocked(draftMode).mockImplementation(() => {
        throw new Error('Not in request context');
      });

      const config: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      mockRequest.mockResolvedValue({
        pages: {
          data: [{ id: '1', attributes: {} }],
        },
      });

      const sdk = createStrapiSDK(config);
      await sdk.getPage('test');

      // Should not include publicationState when draft mode check fails
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.not.objectContaining({
          publicationState: expect.anything(),
        })
      );
    });
  });
});
