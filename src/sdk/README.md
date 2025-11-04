# Data Layer (SDK) - Phase 2

## Overview

The Strapi SDK provides a GraphQL-first data fetching layer with automatic cache tagging for Next.js 14+ App Router applications.

## Features

### ✅ Implemented

- **GraphQL Client**: Built on `graphql-request` for lightweight, type-safe queries
- **Automatic Cache Tagging**: Transparent cache tag injection for Next.js ISR
- **Query Methods**: 
  - `getPage(slug, options)` - Fetch single pages by slug
  - `getCollection(collection, options)` - Fetch collections with filters/pagination
  - `getGlobal(identifier, options)` - Fetch singleton/global data
  - `rawQuery(query, variables)` - Escape hatch for custom GraphQL queries
- **i18n Support**: Full locale support via `QueryOptions`
- **Draft Mode**: Automatic detection and `publicationState: 'PREVIEW'` injection
- **Logging**: Optional query and cache tag logging for debugging

## Usage Example

```typescript
import { createStrapiSDK } from 'strapi-nextgen-framework';

// Create SDK instance
const strapiClient = createStrapiSDK({
  url: process.env.STRAPI_URL!,
  token: process.env.STRAPI_TOKEN,
  logging: {
    queries: true,
    cacheTags: true,
  },
});

// Fetch a page
const homePage = await strapiClient.getPage('home');

// Fetch a collection with filters
const posts = await strapiClient.getCollection('blogPosts', {
  filters: { category: { eq: 'tech' } },
  sort: ['publishedAt:desc'],
  pagination: { limit: 10 },
  locale: 'en',
});

// Fetch global data
const header = await strapiClient.getGlobal('header', {
  locale: 'fr',
});

// Custom query (escape hatch)
const customData = await strapiClient.rawQuery(`
  query CustomQuery {
    pages {
      data {
        id
        attributes {
          title
        }
      }
    }
  }
`);
```

## Cache Tag Strategy

Cache tags are automatically generated using the pattern:

```
strapi_{type}_{identifier}_{locale?}
```

**Examples:**
- `strapi_page_home` - Home page (default locale)
- `strapi_page_about_fr` - About page (French locale)
- `strapi_collection_blogPosts` - Blog posts collection
- `strapi_global_header` - Header global

These tags enable precise on-demand revalidation via webhooks.

## Draft Mode Support

When Next.js draft mode is active (`draftMode().isEnabled`), the SDK automatically:
1. Adds `publicationState: 'PREVIEW'` to all queries
2. Fetches draft/unpublished content from Strapi
3. Bypasses cache for preview requests

## Architecture

```
Developer Code
    ↓
createStrapiSDK(config)
    ↓
GraphQL Client (graphql-request)
    ↓
Custom Fetch Wrapper (cache tag logging)
    ↓
Next.js fetch (with cache tags)
    ↓
Strapi GraphQL API
```

## Files

- **`index.ts`** (186 lines): Main SDK factory and query methods
- **`types.ts`** (44 lines): TypeScript interfaces and types
- **`cache-tags.ts`** (56 lines): Cache tag generation utilities
- **`fetch-wrapper.ts`** (23 lines): Custom fetch with logging

## Next Steps

Developers should use `graphql-codegen` to generate typed queries from their `.graphql` files for full type safety:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript
```

This provides autocomplete and type checking for all Strapi schema fields.
