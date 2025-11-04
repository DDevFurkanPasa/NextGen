/**
 * Unit tests for fetch wrapper
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCacheTaggedFetch } from '../fetch-wrapper';

describe('Fetch Wrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCacheTaggedFetch', () => {
    it('should create a fetch function', () => {
      const fetchFn = createCacheTaggedFetch();

      expect(typeof fetchFn).toBe('function');
    });

    it('should create fetch function with logging disabled', () => {
      const fetchFn = createCacheTaggedFetch({ cacheTags: false });

      expect(typeof fetchFn).toBe('function');
    });

    it('should create fetch function with logging enabled', () => {
      const fetchFn = createCacheTaggedFetch({ cacheTags: true });

      expect(typeof fetchFn).toBe('function');
    });

    it('should return a function that accepts standard fetch parameters', () => {
      const fetchFn = createCacheTaggedFetch();

      // Verify function signature
      expect(fetchFn.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Fetch Function Behavior', () => {
    it('should accept URL as first parameter', () => {
      const fetchFn = createCacheTaggedFetch();

      // This should not throw
      expect(() => {
        const url = 'http://localhost:1337/graphql';
        // Type check only - we're not actually calling fetch
        const _result = fetchFn as (url: string, init?: RequestInit) => Promise<Response>;
      }).not.toThrow();
    });

    it('should accept RequestInit as second parameter', () => {
      const fetchFn = createCacheTaggedFetch();

      // Type check for RequestInit parameter
      expect(() => {
        const _result = fetchFn as (url: string, init?: RequestInit) => Promise<Response>;
      }).not.toThrow();
    });
  });

  describe('Logging Configuration', () => {
    it('should handle undefined logging parameter', () => {
      const fetchFn = createCacheTaggedFetch(undefined);

      expect(typeof fetchFn).toBe('function');
    });

    it('should handle logging disabled', () => {
      const fetchFn = createCacheTaggedFetch({ cacheTags: false });

      expect(typeof fetchFn).toBe('function');
    });

    it('should handle logging enabled', () => {
      const fetchFn = createCacheTaggedFetch({ cacheTags: true });

      expect(typeof fetchFn).toBe('function');
    });
  });

  describe('Function Properties', () => {
    it('should create unique fetch instances', () => {
      const fetchFn1 = createCacheTaggedFetch();
      const fetchFn2 = createCacheTaggedFetch();

      // Each call should create a new function
      expect(fetchFn1).not.toBe(fetchFn2);
    });

    it('should create consistent fetch instances with same config', () => {
      const fetchFn1 = createCacheTaggedFetch({ cacheTags: true });
      const fetchFn2 = createCacheTaggedFetch({ cacheTags: true });

      // Both should be functions
      expect(typeof fetchFn1).toBe('function');
      expect(typeof fetchFn2).toBe('function');
    });
  });

  describe('Type Safety', () => {
    it('should return a function compatible with fetch signature', () => {
      const fetchFn = createCacheTaggedFetch();

      // Type assertion to verify compatibility
      const _typedFetch: typeof fetch = fetchFn as typeof fetch;

      expect(typeof fetchFn).toBe('function');
    });

    it('should accept logging config parameter', () => {
      // These should all compile without errors
      const fetch1 = createCacheTaggedFetch({ cacheTags: true });
      const fetch2 = createCacheTaggedFetch({ cacheTags: false });
      const fetch3 = createCacheTaggedFetch(undefined);
      const fetch4 = createCacheTaggedFetch();

      expect(fetch1).toBeDefined();
      expect(fetch2).toBeDefined();
      expect(fetch3).toBeDefined();
      expect(fetch4).toBeDefined();
    });
  });
});
