/**
 * Data Layer (SDK) - Phase 2 Implementation
 * GraphQL-first SDK with automatic cache tagging for Next.js
 */

import { GraphQLClient } from 'graphql-request';
import type { StrapiSDKConfig, StrapiSDK, QueryOptions } from './types';
import { createCacheTaggedFetch } from './fetch-wrapper';
import { generateCacheTag } from './cache-tags';
import { draftMode } from 'next/headers';

/**
 * Creates a configured Strapi SDK instance
 * 
 * @param config - SDK configuration options
 * @returns Configured SDK instance
 * 
 * @example
 * ```typescript
 * const strapiClient = createStrapiSDK({
 *   url: process.env.STRAPI_URL,
 *   token: process.env.STRAPI_TOKEN,
 * });
 * ```
 */
export function createStrapiSDK(config: StrapiSDKConfig): StrapiSDK {
  // Validate required configuration
  if (!config.url) {
    throw new Error('Strapi URL is required in SDK configuration');
  }

  // Create base headers
  const baseHeaders: Record<string, string> = {};
  if (config.token) {
    baseHeaders.Authorization = `Bearer ${config.token}`;
  }

  // Create GraphQL client
  const client = new GraphQLClient(config.url, {
    headers: baseHeaders,
    fetch: createCacheTaggedFetch(config.logging),
  });

  // Check if draft mode is active (Next.js 14+)
  const isDraftMode = () => {
    try {
      return draftMode().isEnabled;
    } catch {
      // Not in a request context or draft mode not available
      return false;
    }
  };

  // Helper to build GraphQL variables with locale and filters
  const buildVariables = (options?: QueryOptions) => {
    const variables: Record<string, unknown> = {};

    if (options?.locale) {
      variables.locale = options.locale;
    }

    if (options?.filters) {
      variables.filters = options.filters;
    }

    if (options?.sort) {
      variables.sort = options.sort;
    }

    if (options?.pagination) {
      variables.pagination = options.pagination;
    }

    // Add publicationState for draft mode
    if (isDraftMode()) {
      variables.publicationState = 'PREVIEW';
    }

    return variables;
  };

  return {
    /**
     * Fetch a single page by slug
     */
    async getPage<T>(slug: string, options?: QueryOptions): Promise<T> {
      const tag = generateCacheTag('page', slug, options?.locale);
      
      if (config.logging?.queries) {
        console.log(`[Strapi SDK] getPage: ${slug}`, { tag, options });
      }

      // This is a simplified query - in real usage, developers will use graphql-codegen
      // to generate typed queries from their .graphql files
      const query = `
        query GetPage($slug: String!, $locale: String, $publicationState: PublicationState) {
          pages(filters: { slug: { eq: $slug } }, locale: $locale, publicationState: $publicationState) {
            data {
              id
              attributes
            }
          }
        }
      `;

      const variables = { slug, ...buildVariables(options) };
      
      // Note: Cache tags are handled by the custom fetch wrapper
      // graphql-request doesn't support Next.js options directly
      const data = await client.request<{ pages: { data: T[] } }>(query, variables);

      const firstPage = data.pages.data[0];
      if (!firstPage) {
        throw new Error(`Page not found: ${slug}`);
      }

      return firstPage;
    },

    /**
     * Fetch a collection of items
     */
    async getCollection<T>(collection: string, options?: QueryOptions): Promise<T[]> {
      const tag = generateCacheTag('collection', collection, options?.locale);
      
      if (config.logging?.queries) {
        console.log(`[Strapi SDK] getCollection: ${collection}`, { tag, options });
      }

      // Simplified query - real usage will use graphql-codegen
      const query = `
        query GetCollection($locale: String, $filters: JSON, $sort: [String], $pagination: PaginationArg, $publicationState: PublicationState) {
          ${collection}(locale: $locale, filters: $filters, sort: $sort, pagination: $pagination, publicationState: $publicationState) {
            data {
              id
              attributes
            }
          }
        }
      `;

      const variables = buildVariables(options);
      const data = await client.request<Record<string, { data: T[] }>>(query, variables);

      const collectionData = data[collection];
      return collectionData ? collectionData.data : [];
    },

    /**
     * Fetch global/singleton data
     */
    async getGlobal<T>(identifier: string, options?: QueryOptions): Promise<T> {
      const tag = generateCacheTag('global', identifier, options?.locale);
      
      if (config.logging?.queries) {
        console.log(`[Strapi SDK] getGlobal: ${identifier}`, { tag, options });
      }

      // Simplified query - real usage will use graphql-codegen
      const query = `
        query GetGlobal($locale: String, $publicationState: PublicationState) {
          ${identifier}(locale: $locale, publicationState: $publicationState) {
            data {
              id
              attributes
            }
          }
        }
      `;

      const variables = buildVariables(options);
      const data = await client.request<Record<string, { data: T }>>(query, variables);

      const globalData = data[identifier];
      if (!globalData) {
        throw new Error(`Global not found: ${identifier}`);
      }

      return globalData.data;
    },

    /**
     * Execute a raw GraphQL query (escape hatch)
     */
    async rawQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
      if (config.logging?.queries) {
        console.log('[Strapi SDK] rawQuery', { query, variables });
      }

      return client.request<T>(query, variables);
    },
  };
}
