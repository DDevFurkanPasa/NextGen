/**
 * Revalidation Handler Tests
 * Target: 90%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStrapiRevalidator } from '../index';

// Mock Next.js modules
vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

vi.mock('next/server', () => {
  const NextResponse = {
    json: vi.fn((body: any, init?: any) => ({
      body,
      status: init?.status || 200,
      headers: init?.headers || {},
    })),
  };
  return { NextResponse };
});

import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

describe('createStrapiRevalidator', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const createMockRequest = (
    secret: string | null,
    payload: any
  ): NextRequest => {
    const headers = new Headers();
    if (secret !== null) {
      headers.set('authorization', `Bearer ${secret}`);
    }
    
    return {
      headers,
      json: async () => payload,
    } as NextRequest;
  };

  describe('Secret validation', () => {
    it('should accept valid secret and revalidate', async () => {
      const handler = createStrapiRevalidator({
        secret: 'valid-secret-123',
        logging: false,
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::page.page',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest('valid-secret-123', payload);
      const response = await handler(mockRequest);

      expect(response.status).toBe(200);
      expect(revalidateTag).toHaveBeenCalled();
    });

    it('should reject request with invalid secret and return 401', async () => {
      const handler = createStrapiRevalidator({
        secret: 'correct-secret',
        logging: false,
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::page.page',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest('wrong-secret', payload);
      const response = await handler(mockRequest);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Unauthorized' },
        { status: 401 }
      );
      expect(response.status).toBe(401);
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it('should reject request with missing secret', async () => {
      const handler = createStrapiRevalidator({
        secret: 'required-secret',
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::page.page',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest(null, payload);
      const response = await handler(mockRequest);

      expect(response.status).toBe(401);
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it('should log error when secret is invalid and logging enabled', async () => {
      const handler = createStrapiRevalidator({
        secret: 'correct-secret',
        logging: true,
      });

      const mockRequest = createMockRequest('wrong-secret', {});
      await handler(mockRequest);

      expect(consoleErrorSpy).toHaveBeenCalledWith('[StrapiRevalidator] Invalid webhook secret');
    });

    it('should not log when secret is invalid and logging disabled', async () => {
      const handler = createStrapiRevalidator({
        secret: 'correct-secret',
        logging: false,
      });

      const mockRequest = createMockRequest('wrong-secret', {});
      await handler(mockRequest);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Payload parsing and tag mapping', () => {
    it('should correctly parse valid Strapi payload (entry.publish)', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        logging: true,
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::blog-post.blog-post',
        entry: { id: 42, title: 'Test Post' },
      };

      const mockRequest = createMockRequest('secret', payload);
      await handler(mockRequest);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[StrapiRevalidator] Webhook received:',
        {
          event: 'entry.publish',
          model: 'api::blog-post.blog-post',
          entryId: 42,
        }
      );
    });

    it('should correctly map model name to tag using tagMap', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        tagMap: {
          'api::page.page': 'strapi_page',
          'api::blog-post.blog-post': 'strapi_collection_blogPosts',
        },
        logging: false,
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::blog-post.blog-post',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest('secret', payload);
      const response = await handler(mockRequest);

      expect(revalidateTag).toHaveBeenCalledWith('strapi_collection_blogPosts');
      expect((response as any).body.tag).toBe('strapi_collection_blogPosts');
    });

    it('should call revalidateTag with correct tag', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        tagMap: {
          'api::page.page': 'custom_page_tag',
        },
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::page.page',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest('secret', payload);
      await handler(mockRequest);

      expect(revalidateTag).toHaveBeenCalledWith('custom_page_tag');
      expect(revalidateTag).toHaveBeenCalledTimes(1);
    });

    it('should auto-generate tag from model name when not in tagMap', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        tagMap: {
          'api::page.page': 'strapi_page',
        },
        logging: true,
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::article.article',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest('secret', payload);
      const response = await handler(mockRequest);

      // Should generate 'strapi_article' from 'api::article.article'
      expect(revalidateTag).toHaveBeenCalledWith('strapi_article');
      expect((response as any).body.tag).toBe('strapi_article');
    });

    it('should handle unknown model in tagMap gracefully (auto-generate)', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        logging: false,
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::unknown-model.unknown-model',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest('secret', payload);
      const response = await handler(mockRequest);

      expect(revalidateTag).toHaveBeenCalledWith('strapi_unknown-model');
      expect(response.status).toBe(200);
    });

    it('should log revalidation when logging enabled', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        logging: true,
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::page.page',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest('secret', payload);
      await handler(mockRequest);

      expect(consoleLogSpy).toHaveBeenCalledWith('[StrapiRevalidator] Revalidated tag:', 'strapi_page');
    });
  });

  describe('Error handling', () => {
    it('should handle missing payload and return 500', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        logging: false,
      });

      const mockRequest = {
        headers: new Headers({ authorization: 'Bearer secret' }),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as NextRequest;

      const response = await handler(mockRequest);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        { status: 500 }
      );
      expect(response.status).toBe(500);
    });

    it('should handle malformed payload and return 500', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
      });

      const mockRequest = {
        headers: new Headers({ authorization: 'Bearer secret' }),
        json: async () => {
          throw new Error('Malformed payload');
        },
      } as unknown as NextRequest;

      const response = await handler(mockRequest);

      expect(response.status).toBe(500);
    });

    it('should log errors when logging enabled', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        logging: true,
      });

      const testError = new Error('Test error');
      const mockRequest = {
        headers: new Headers({ authorization: 'Bearer secret' }),
        json: async () => {
          throw testError;
        },
      } as unknown as NextRequest;

      await handler(mockRequest);

      expect(consoleErrorSpy).toHaveBeenCalledWith('[StrapiRevalidator] Error:', testError);
    });

    it('should not log errors when logging disabled', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        logging: false,
      });

      const mockRequest = {
        headers: new Headers({ authorization: 'Bearer secret' }),
        json: async () => {
          throw new Error('Test error');
        },
      } as unknown as NextRequest;

      await handler(mockRequest);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Response format', () => {
    it('should return correct success response format', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        tagMap: {
          'api::page.page': 'custom_tag',
        },
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::page.page',
        entry: { id: 1 },
      };

      const mockRequest = createMockRequest('secret', payload);
      const response = await handler(mockRequest);

      expect((response as any).body.revalidated).toBe(true);
      expect((response as any).body.tag).toBe('custom_tag');
      expect((response as any).body.now).toBeDefined();
      expect(typeof (response as any).body.now).toBe('number');
    });
  });

  describe('Complex scenarios', () => {
    it('should handle multiple model formats correctly', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
      });

      // Test simple model name
      const payload1 = {
        event: 'entry.publish',
        model: 'page',
        entry: { id: 1 },
      };

      const mockRequest1 = createMockRequest('secret', payload1);
      const response1 = await handler(mockRequest1);

      expect(revalidateTag).toHaveBeenCalledWith('strapi_page');

      // Test complex model name
      const payload2 = {
        event: 'entry.update',
        model: 'api::blog-post.blog-post',
        entry: { id: 2 },
      };

      const mockRequest2 = createMockRequest('secret', payload2);
      const response2 = await handler(mockRequest2);

      expect(revalidateTag).toHaveBeenCalledWith('strapi_blog-post');
    });

    it('should handle entry with additional fields', async () => {
      const handler = createStrapiRevalidator({
        secret: 'secret',
        logging: true,
      });

      const payload = {
        event: 'entry.publish',
        model: 'api::page.page',
        entry: {
          id: 99,
          title: 'Test Page',
          slug: 'test-page',
          content: 'Content here',
          publishedAt: '2024-01-01',
        },
      };

      const mockRequest = createMockRequest('secret', payload);
      const response = await handler(mockRequest);

      expect(response.status).toBe(200);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[StrapiRevalidator] Webhook received:',
        expect.objectContaining({
          entryId: 99,
        })
      );
    });
  });
});
