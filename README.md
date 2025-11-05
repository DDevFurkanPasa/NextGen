# Strapi-NextGen Framework

> A high-performance, type-safe framework bridging Strapi CMS and Next.js with automatic cache management and dynamic rendering.

[![npm version](https://img.shields.io/npm/v/strapi-nextgen-framework.svg)](https://www.npmjs.com/package/strapi-nextgen-framework)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Documentation](https://img.shields.io/badge/docs-online-brightgreen.svg)](https://strapi-next-gen.vercel.app/)

## 📚 [Documentation](https://strapi-next-gen.vercel.app/)

**[→ Read the full documentation](https://strapi-next-gen.vercel.app/)**

- [Quick Start Tutorial](https://strapi-next-gen.vercel.app/tutorials/quick-start) - Get up and running in 5 minutes
- [API Reference](https://strapi-next-gen.vercel.app/api-reference) - Complete API documentation
- [Guides](https://strapi-next-gen.vercel.app/guides) - Step-by-step how-to guides
- [Concepts](https://strapi-next-gen.vercel.app/concepts) - Deep dives into architecture and design

## 🚀 Features

- **Type-Safe by Default**: Automatic TypeScript type generation from GraphQL schemas
- **Performance First**: Built-in ISR with automatic cache tagging and on-demand revalidation
- **Developer Experience**: Intuitive APIs with minimal configuration
- **Resilient**: Error boundaries and Zod validation prevent page crashes
- **GraphQL-First**: No more complex REST `populate` queries
- **Next.js 14 Ready**: Full App Router support with React Server Components

## 📦 Installation

```bash
npm install strapi-nextgen-framework graphql graphql-request zod
```

### Dev Dependencies (for type generation)

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-graphql-request
```

## 🏗️ Project Status

**Current Version**: 0.1.0 (Release)

**🎉 Production-Ready Release!** All core features are implemented, documented, and ready for use:

- [x] **Phase 1**: Project Setup ✅
- [x] **Phase 2**: Data Layer (SDK) ✅
- [x] **Phase 3**: Presentation Layer (Renderer) ✅
- [x] **Phase 4**: Advanced Features ✅
- [x] **Phase 5**: Documentation & Examples ✅
- [ ] **Phase 6**: Testing & CI/CD (Future Enhancement)

## 🎯 Quick Start

> **💡 For a detailed step-by-step guide, see the [Quick Start Tutorial](https://strapi-next-gen.vercel.app/tutorials/quick-start) in our documentation.**

### 1. Set up environment variables

```bash
# .env.local
STRAPI_URL=http://localhost:1337/graphql
STRAPI_TOKEN=your_api_token_here
STRAPI_WEBHOOK_SECRET=your_webhook_secret
STRAPI_PREVIEW_SECRET=your_preview_secret
```

### 2. Initialize the SDK

```typescript
// lib/strapi.ts
import { createStrapiSDK } from 'strapi-nextgen-framework';

export const strapiClient = createStrapiSDK({
  url: process.env.STRAPI_URL!,
  token: process.env.STRAPI_TOKEN,
  defaultLocale: 'en',
  logging: {
    queries: process.env.NODE_ENV === 'development',
    cacheTags: process.env.NODE_ENV === 'development',
  },
});
```

### 3. Create a page with SEO

```typescript
// app/[slug]/page.tsx
import { strapiClient } from '@/lib/strapi';
import { generateStrapiMetadata, StrapiRenderer } from 'strapi-nextgen-framework';
import { componentMap } from '@/components/strapi';

interface PageProps {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const page = await strapiClient.getPage(params.slug);
  
  return generateStrapiMetadata(page.attributes.seo, {
    metadataBase: new URL('https://example.com'),
  });
}

// Render the page
export default async function Page({ params }: PageProps) {
  const page = await strapiClient.getPage(params.slug);
  
  return (
    <main>
      <StrapiRenderer 
        data={page.attributes.dynamicZone} 
        map={componentMap}
        validation="warn"
      />
    </main>
  );
}
```

### 4. Set up component mapping

```typescript
// components/strapi/index.tsx
import { z } from 'zod';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';

export const componentMap = {
  'sections.hero': {
    component: HeroSection,
    schema: z.object({
      __component: z.literal('sections.hero'),
      title: z.string(),
      subtitle: z.string().optional(),
    }),
  },
  'sections.features': {
    component: FeaturesSection,
    schema: z.object({
      __component: z.literal('sections.features'),
      features: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })),
    }),
  },
};
```

### 5. Set up webhook revalidation

```typescript
// app/api/revalidate/route.ts
import { createStrapiRevalidator } from 'strapi-nextgen-framework';

const handler = createStrapiRevalidator({
  secret: process.env.STRAPI_WEBHOOK_SECRET!,
  tagMap: {
    'api::page.page': 'strapi_page',
    'api::blog-post.blog-post': 'strapi_collection_blogPosts',
  },
  logging: true,
});

export { handler as POST };
```

### 6. Set up preview mode

```typescript
// app/api/preview/route.ts
import { createPreviewHandler } from 'strapi-nextgen-framework';

const handler = createPreviewHandler({
  secret: process.env.STRAPI_PREVIEW_SECRET!,
  logging: true,
});

export { handler as GET };

// app/api/exit-preview/route.ts
import { createExitPreviewHandler } from 'strapi-nextgen-framework';

const handler = createExitPreviewHandler();
export { handler as GET };
```

## 📚 Core Concepts

### Data Layer (SDK)
- GraphQL-first querying with automatic type generation
- Automatic cache tagging for instant revalidation
- Escape hatches for advanced use cases

### Presentation Layer (Renderer)
- Dynamic zone rendering with component mapping
- Automatic error boundaries
- Zod validation in development mode

### Advanced Features
- SEO metadata generation
- Image optimization with next/image
- Webhook-based revalidation
- Preview/draft mode support

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Type checking
npm run type-check

# Lint
npm run lint
```

## 📖 API Reference

> **📚 For complete API documentation with examples and troubleshooting, visit [API Reference](https://strapi-next-gen.vercel.app/api-reference)**

### Data Layer (SDK)

#### `createStrapiSDK(config)`

Creates a Strapi SDK instance with automatic cache tagging.

**Parameters:**
- `url` (string, required): Strapi GraphQL endpoint URL
- `token` (string, optional): API token for authenticated requests
- `defaultLocale` (string, optional): Default locale for i18n queries
- `logging` (object, optional): Logging configuration
  - `queries` (boolean): Log all GraphQL queries
  - `cacheTags` (boolean): Log cache tags
  - `validation` ('error' | 'warn' | 'silent'): Validation error logging

**Returns:** `StrapiSDK` instance

**Methods:**
- `getPage<T>(slug, options?)`: Fetch a single page by slug
- `getCollection<T>(collectionName, options?)`: Fetch a collection
- `getGlobal<T>(globalName, options?)`: Fetch a global singleton
- `rawQuery<T>(query, variables?, options?)`: Execute custom GraphQL query

**Example:**
```typescript
const sdk = createStrapiSDK({
  url: 'http://localhost:1337/graphql',
  token: 'your-token',
  defaultLocale: 'en',
});

const page = await sdk.getPage('home', { locale: 'fr' });
```

### Presentation Layer (Renderer)

#### `<StrapiRenderer />`

Renders Strapi dynamic zones with automatic component mapping and error boundaries.

**Props:**
- `data` (array, required): Array of Strapi components
- `map` (ComponentMap, required): Component mapping object
- `validation` ('error' | 'warn' | 'silent', optional): Validation mode
- `fallback` (ReactNode, optional): Fallback UI for errors
- `onError` (function, optional): Error callback

**Example:**
```tsx
<StrapiRenderer
  data={page.attributes.dynamicZone}
  map={componentMap}
  validation="warn"
  fallback={<div>Something went wrong</div>}
  onError={(error, errorInfo, componentType) => {
    console.error('Component error:', componentType, error);
  }}
/>
```

### Advanced Features

#### `generateStrapiMetadata(seoData, defaults?)`

Generates Next.js metadata from Strapi SEO component.

**Parameters:**
- `seoData` (StrapiSEO | null | undefined): Strapi SEO component data
- `defaults` (Partial<Metadata>, optional): Default metadata values

**Returns:** Next.js `Metadata` object

**Example:**
```typescript
export async function generateMetadata({ params }) {
  const page = await strapiClient.getPage(params.slug);
  return generateStrapiMetadata(page.attributes.seo, {
    metadataBase: new URL('https://example.com'),
  });
}
```

#### `<StrapiImage />`

Optimized image component with next/image integration.

**Props:**
- `data` (StrapiMedia, required): Strapi media object
- `nextImageProps` (ImageProps, optional): Additional next/image props
- `fallback` (string, optional): Fallback image URL

**Example:**
```tsx
<StrapiImage
  data={page.attributes.hero.image}
  nextImageProps={{
    priority: true,
    className: 'rounded-lg',
    fill: true,
  }}
  fallback="/placeholder.jpg"
/>
```

#### `createStrapiRevalidator(config)`

Creates a webhook handler for on-demand ISR revalidation.

**Parameters:**
- `secret` (string, required): Webhook secret for validation
- `tagMap` (object, optional): Custom model-to-tag mapping
- `logging` (boolean, optional): Enable logging

**Returns:** Next.js Route Handler

**Example:**
```typescript
const handler = createStrapiRevalidator({
  secret: process.env.STRAPI_WEBHOOK_SECRET!,
  tagMap: {
    'api::page.page': 'strapi_page',
  },
  logging: true,
});

export { handler as POST };
```

#### `createPreviewHandler(config)`

Creates a preview mode handler for draft content.

**Parameters:**
- `secret` (string, required): Preview secret for validation
- `logging` (boolean, optional): Enable logging

**Returns:** Next.js Route Handler

**Usage:** `/api/preview?secret=YOUR_SECRET&slug=/about`

#### `createExitPreviewHandler()`

Creates a handler to disable preview mode.

**Returns:** Next.js Route Handler

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

GPL-3.0 © fuqom

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [📚 Documentation](https://strapi-next-gen.vercel.app/) - Complete documentation site
- [🚀 Quick Start](https://strapi-next-gen.vercel.app/tutorials/quick-start) - 5-minute setup guide
- [📦 npm Package](https://www.npmjs.com/package/strapi-nextgen-framework)
- [🐙 GitHub Repository](https://github.com/DDevFurkanPasa/NextGen)
- [🐛 Issue Tracker](https://github.com/DDevFurkanPasa/NextGen/issues)

---

**Note**: This framework requires Strapi v4 with GraphQL plugin and Next.js 14+ with App Router.
