/**
 * Cache tag generation utilities
 * Generates consistent cache tags for Next.js revalidation
 */

/**
 * Generates a cache tag for a Strapi resource
 * 
 * @param type - Resource type (page, collection, global)
 * @param identifier - Resource identifier (slug, collection name, global name)
 * @param locale - Optional locale for i18n
 * @returns Cache tag string
 * 
 * @example
 * ```typescript
 * generateCacheTag('page', 'home') // 'strapi_page_home'
 * generateCacheTag('page', 'about', 'fr') // 'strapi_page_about_fr'
 * generateCacheTag('collection', 'blogPosts') // 'strapi_collection_blogPosts'
 * generateCacheTag('global', 'header') // 'strapi_global_header'
 * ```
 */
export function generateCacheTag(
  type: 'page' | 'collection' | 'global',
  identifier: string,
  locale?: string
): string {
  const baseTag = `strapi_${type}_${identifier}`;
  return locale ? `${baseTag}_${locale}` : baseTag;
}

/**
 * Parses a cache tag back into its components
 * Useful for debugging and tag mapping
 * 
 * @param tag - Cache tag string
 * @returns Parsed tag components or null if invalid
 */
export function parseCacheTag(tag: string): {
  type: 'page' | 'collection' | 'global';
  identifier: string;
  locale?: string;
} | null {
  const match = tag.match(/^strapi_(page|collection|global)_([^_]+)(?:_(.+))?$/);
  
  if (!match) {
    return null;
  }

  return {
    type: match[1] as 'page' | 'collection' | 'global',
    identifier: match[2]!,
    locale: match[3],
  };
}
