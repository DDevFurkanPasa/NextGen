/**
 * Preview Mode Handler - Phase 4 Implementation
 * This is a placeholder for the preview/draft mode handler
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Configuration for the preview handler
 */
export interface PreviewConfig {
  /** Secret for preview mode validation */
  secret: string;
  /** Enable logging */
  logging?: boolean;
}

/**
 * Creates a preview mode handler for draft content
 * 
 * Enables Next.js draft mode to preview unpublished content from Strapi.
 * The SDK automatically detects draft mode and fetches draft content.
 * 
 * @param config - Preview configuration
 * @returns Next.js Route Handler
 * 
 * @example
 * ```typescript
 * // app/api/preview/route.ts
 * import { createPreviewHandler } from 'strapi-nextgen-framework';
 * 
 * const handler = createPreviewHandler({
 *   secret: process.env.STRAPI_PREVIEW_SECRET!,
 *   logging: true,
 * });
 * 
 * export { handler as GET };
 * ```
 * 
 * Usage:
 * ```
 * /api/preview?secret=YOUR_SECRET&slug=/about
 * ```
 */
export function createPreviewHandler(config: PreviewConfig) {
  return async function handler(request: NextRequest) {
    try {
      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const secret = searchParams.get('secret');
      const slug = searchParams.get('slug') || '/';

      // Validate secret
      if (!secret || secret !== config.secret) {
        if (config.logging) {
          console.error('[PreviewHandler] Invalid preview secret');
        }
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }

      // Enable draft mode
      draftMode().enable();

      if (config.logging) {
        console.log('[PreviewHandler] Draft mode enabled for:', slug);
      }

      // Redirect to the path
      redirect(slug);
    } catch (error) {
      if (config.logging) {
        console.error('[PreviewHandler] Error:', error);
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates a handler to disable preview mode
 * 
 * @example
 * ```typescript
 * // app/api/exit-preview/route.ts
 * import { createExitPreviewHandler } from 'strapi-nextgen-framework';
 * 
 * const handler = createExitPreviewHandler();
 * export { handler as GET };
 * ```
 */
export function createExitPreviewHandler() {
  return async function handler() {
    draftMode().disable();
    return NextResponse.json({ preview: false });
  };
}
