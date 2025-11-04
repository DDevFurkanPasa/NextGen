# Migration Guide

## From Manual Strapi + Next.js Setup

This guide helps you migrate from a manual Strapi + Next.js integration to the Strapi-NextGen Framework.

## Prerequisites

- Strapi v4 with GraphQL plugin installed
- Next.js 14+ with App Router
- Existing Strapi content types and data

## Step 1: Install the Framework

```bash
npm install strapi-nextgen-framework graphql graphql-request zod
```

### Optional: Install GraphQL Code Generator

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-graphql-request
```

## Step 2: Replace REST API Calls with SDK

### Before (REST API)

```typescript
// Old approach with REST API
async function getPage(slug: string) {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate=deep`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      next: { tags: [`page-${slug}`] },
    }
  );
  
  const data = await res.json();
  return data.data[0];
}
```

### After (SDK)

```typescript
// New approach with SDK
import { createStrapiSDK } from 'strapi-nextgen-framework';

const strapiClient = createStrapiSDK({
  url: process.env.STRAPI_URL!,
  token: process.env.STRAPI_TOKEN,
});

// Automatic cache tagging!
const page = await strapiClient.getPage(slug);
```

**Benefits:**
- ✅ No more complex `populate` queries
- ✅ Automatic cache tagging
- ✅ Type-safe with GraphQL
- ✅ Cleaner, more readable code

## Step 3: Replace Manual Dynamic Zone Rendering

### Before (Manual Rendering)

```tsx
// Old approach - manual component mapping
export function DynamicZone({ components }) {
  return (
    <>
      {components.map((component, index) => {
        switch (component.__component) {
          case 'sections.hero':
            return <HeroSection key={index} {...component} />;
          case 'sections.features':
            return <FeaturesSection key={index} {...component} />;
          default:
            console.warn('Unknown component:', component.__component);
            return null;
        }
      })}
    </>
  );
}
```

### After (StrapiRenderer)

```tsx
// New approach - declarative component mapping
import { StrapiRenderer } from 'strapi-nextgen-framework';
import { componentMap } from '@/components/strapi';

export function DynamicZone({ components }) {
  return (
    <StrapiRenderer
      data={components}
      map={componentMap}
      validation="warn"
    />
  );
}
```

**Component Map:**

```typescript
// components/strapi/index.tsx
import { z } from 'zod';

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

**Benefits:**
- ✅ Automatic Error Boundaries per component
- ✅ Runtime validation with Zod
- ✅ Better error messages in development
- ✅ Graceful degradation in production

## Step 4: Replace Manual SEO Metadata

### Before (Manual Metadata)

```typescript
// Old approach - manual metadata construction
export async function generateMetadata({ params }) {
  const page = await getPage(params.slug);
  const seo = page.attributes.seo;
  
  return {
    title: seo?.metaTitle || 'Default Title',
    description: seo?.metaDescription,
    openGraph: {
      title: seo?.metaTitle,
      description: seo?.metaDescription,
      images: seo?.metaImage?.data?.attributes?.url
        ? [{ url: seo.metaImage.data.attributes.url }]
        : undefined,
    },
    // ... more manual mapping
  };
}
```

### After (generateStrapiMetadata)

```typescript
// New approach - automatic metadata generation
import { generateStrapiMetadata } from 'strapi-nextgen-framework';

export async function generateMetadata({ params }) {
  const page = await strapiClient.getPage(params.slug);
  
  return generateStrapiMetadata(page.attributes.seo, {
    metadataBase: new URL('https://example.com'),
  });
}
```

**Benefits:**
- ✅ Automatic Open Graph tags
- ✅ Automatic Twitter Card tags
- ✅ Canonical URLs
- ✅ Structured data support
- ✅ Social media overrides

## Step 5: Replace Manual Image Optimization

### Before (Manual next/image)

```tsx
// Old approach - manual image handling
import Image from 'next/image';

export function HeroSection({ image }) {
  const imageData = image?.data?.attributes;
  
  if (!imageData) return null;
  
  return (
    <Image
      src={imageData.url}
      alt={imageData.alternativeText || ''}
      width={imageData.width}
      height={imageData.height}
    />
  );
}
```

### After (StrapiImage)

```tsx
// New approach - automatic image handling
import { StrapiImage } from 'strapi-nextgen-framework';

export function HeroSection({ image }) {
  return (
    <StrapiImage
      data={image}
      nextImageProps={{
        priority: true,
        className: 'rounded-lg',
      }}
      fallback="/placeholder.jpg"
    />
  );
}
```

**Benefits:**
- ✅ Automatic width/height extraction
- ✅ Fallback support
- ✅ Alt text from Strapi
- ✅ Fill mode support

## Step 6: Replace Manual Revalidation

### Before (Manual Revalidation)

```typescript
// Old approach - manual webhook handler
export async function POST(request: Request) {
  const body = await request.json();
  const secret = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (secret !== process.env.STRAPI_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Manual tag determination
  let tag: string;
  if (body.model === 'api::page.page') {
    tag = 'page';
  } else if (body.model === 'api::blog-post.blog-post') {
    tag = 'blog-posts';
  }
  
  revalidateTag(tag);
  
  return Response.json({ revalidated: true });
}
```

### After (createStrapiRevalidator)

```typescript
// New approach - automatic webhook handler
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

**Benefits:**
- ✅ Automatic secret validation
- ✅ Automatic tag generation
- ✅ Custom tag mapping
- ✅ Error handling
- ✅ Logging support

## Step 7: Add Preview Mode (New Feature!)

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

**Usage:**
```
/api/preview?secret=YOUR_SECRET&slug=/about
```

The SDK automatically detects draft mode and fetches unpublished content!

## Step 8: Update Environment Variables

```bash
# .env.local

# Required
STRAPI_URL=http://localhost:1337/graphql  # Changed from /api to /graphql
STRAPI_TOKEN=your_api_token_here

# Optional (for webhooks)
STRAPI_WEBHOOK_SECRET=your_webhook_secret

# Optional (for preview mode)
STRAPI_PREVIEW_SECRET=your_preview_secret
```

## Step 9: Configure Strapi Webhooks

In Strapi Admin:

1. Go to **Settings** → **Webhooks**
2. Create a new webhook
3. **URL**: `https://your-site.com/api/revalidate`
4. **Headers**: 
   - `Authorization`: `Bearer YOUR_WEBHOOK_SECRET`
5. **Events**: Select `entry.publish`, `entry.update`, `entry.delete`

## Migration Checklist

- [ ] Install `strapi-nextgen-framework` and dependencies
- [ ] Replace REST API calls with SDK
- [ ] Create component map for dynamic zones
- [ ] Replace manual rendering with `<StrapiRenderer />`
- [ ] Replace manual metadata with `generateStrapiMetadata()`
- [ ] Replace manual images with `<StrapiImage />`
- [ ] Set up webhook revalidation handler
- [ ] Set up preview mode handlers (optional)
- [ ] Update environment variables
- [ ] Configure Strapi webhooks
- [ ] Test all pages and features
- [ ] Remove old helper functions

## Common Issues

### Issue: GraphQL endpoint not found

**Solution:** Make sure Strapi GraphQL plugin is installed:
```bash
npm install @strapi/plugin-graphql
```

### Issue: Cache not invalidating

**Solution:** Check that:
1. Webhook secret matches in both Strapi and Next.js
2. Tag mapping is correct
3. Webhook is configured for the right events

### Issue: Types not working

**Solution:** Use GraphQL Code Generator for type safety:
```bash
npx graphql-codegen init
```

## Performance Comparison

| Metric | Before (REST) | After (Framework) |
|--------|--------------|-------------------|
| Bundle Size | Larger (manual code) | Smaller (tree-shakeable) |
| Type Safety | Manual types | Auto-generated |
| Error Handling | Manual try/catch | Automatic Error Boundaries |
| Cache Management | Manual tags | Automatic tagging |
| Developer Time | Hours | Minutes |

## Next Steps

1. Read the [API Reference](../README.md#api-reference)
2. Check out example implementations in `src/sdk/README.md` and `src/renderer/README.md`
3. Join our community for support

---

**Questions?** Open an issue on [GitHub](https://github.com/DDevFurkanPasa/NextGen/issues)
