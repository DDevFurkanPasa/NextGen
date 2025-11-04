/**
 * Revalidation Handler - Phase 4 Implementation
 * This is a placeholder for the webhook revalidation handler
 */

import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Configuration for the revalidation handler
 */
export interface RevalidatorConfig {
  /** Webhook secret for validation */
  secret: string;
  /** Optional mapping of Strapi model names to cache tag prefixes */
  tagMap?: Record<string, string>;
  /** Enable logging */
  logging?: boolean;
}

interface StrapiWebhookPayload {
  event: string;
  model: string;
  entry: {
    id: number;
    [key: string]: unknown;
  };
}

/**
 * Creates a webhook handler for Strapi on-demand revalidation
 * 
 * Automatically revalidates Next.js cache when content is published in Strapi.
 * 
 * @param config - Revalidator configuration
 * @returns Next.js Route Handler
 * 
 * @example
 * ```typescript
 * // app/api/revalidate/route.ts
 * import { createStrapiRevalidator } from 'strapi-nextgen-framework';
 * 
 * const handler = createStrapiRevalidator({
 *   secret: process.env.STRAPI_WEBHOOK_SECRET!,
 *   tagMap: {
 *     'api::page.page': 'strapi_page',
 *     'api::blog-post.blog-post': 'strapi_collection_blogPosts',
 *     'api::global.global': 'strapi_global',
 *   },
 *   logging: true,
 * });
 * 
 * export { handler as POST };
 * ```
 */
export function createStrapiRevalidator(config: RevalidatorConfig) {
  return async function handler(request: NextRequest) {
    try {
      // Validate webhook secret
      const authHeader = request.headers.get('authorization');
      const providedSecret = authHeader?.replace('Bearer ', '');

      if (!providedSecret || providedSecret !== config.secret) {
        if (config.logging) {
          console.error('[StrapiRevalidator] Invalid webhook secret');
        }
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Parse webhook payload
      const payload = (await request.json()) as StrapiWebhookPayload;

      if (config.logging) {
        console.log('[StrapiRevalidator] Webhook received:', {
          event: payload.event,
          model: payload.model,
          entryId: payload.entry?.id,
        });
      }

      // Determine cache tag to revalidate
      let tag: string | undefined;

      if (config.tagMap && config.tagMap[payload.model]) {
        // Use custom tag mapping
        tag = config.tagMap[payload.model];
      } else {
        // Generate default tag from model name
        // e.g., 'api::page.page' -> 'strapi_page'
        const modelParts = payload.model.split('.');
        const modelName = modelParts[modelParts.length - 1];
        tag = `strapi_${modelName}`;
      }

      if (!tag) {
        if (config.logging) {
          console.warn('[StrapiRevalidator] No tag mapping for model:', payload.model);
        }
        return NextResponse.json(
          { error: 'No tag mapping found' },
          { status: 400 }
        );
      }

      // Revalidate the tag
      revalidateTag(tag);

      if (config.logging) {
        console.log('[StrapiRevalidator] Revalidated tag:', tag);
      }

      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now(),
      });
    } catch (error) {
      if (config.logging) {
        console.error('[StrapiRevalidator] Error:', error);
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
