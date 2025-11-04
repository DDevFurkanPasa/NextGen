/**
 * SDK type definitions
 */

/**
 * Configuration options for the Strapi SDK
 */
export interface StrapiSDKConfig {
  /** Strapi GraphQL endpoint URL */
  url: string;
  /** Optional API token for authenticated requests */
  token?: string;
  /** Default locale for i18n queries */
  defaultLocale?: string;
  /** Optional logging configuration */
  logging?: {
    /** Log all GraphQL queries */
    queries?: boolean;
    /** Log cache tags */
    cacheTags?: boolean;
    /** Log validation errors */
    validation?: 'error' | 'warn' | 'silent';
  };
}

/**
 * Main SDK interface
 */
export interface StrapiSDK {
  /** Fetch a single page by slug */
  getPage: <T>(slug: string, options?: QueryOptions) => Promise<T>;
  /** Fetch a collection of items */
  getCollection: <T>(collection: string, options?: QueryOptions) => Promise<T[]>;
  /** Fetch global/singleton data */
  getGlobal: <T>(identifier: string, options?: QueryOptions) => Promise<T>;
  /** Execute a raw GraphQL query (escape hatch) */
  rawQuery: <T>(query: string, variables?: Record<string, unknown>) => Promise<T>;
}

/**
 * Query options for SDK methods
 */
export interface QueryOptions {
  /** Locale for i18n */
  locale?: string;
  /** Additional filters */
  filters?: Record<string, unknown>;
  /** Sorting options */
  sort?: string[];
  /** Pagination */
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}
