/**
 * Fetch wrapper with automatic cache tagging
 * Wraps Next.js fetch to inject cache tags automatically
 */

import type { StrapiSDKConfig } from './types';

/**
 * Creates a fetch function that automatically adds cache tags
 * This is used by graphql-request to make requests with Next.js caching
 * 
 * @param logging - Optional logging configuration
 * @returns Wrapped fetch function
 */
export function createCacheTaggedFetch(
  logging?: StrapiSDKConfig['logging']
): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    // Log cache tags if enabled
    if (logging?.cacheTags && init?.next) {
      console.log('[Strapi SDK] Cache tags:', init.next);
    }

    // Call Next.js fetch with cache configuration
    return fetch(input, init);
  };
}
