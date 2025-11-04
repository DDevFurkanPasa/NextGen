# Usage Examples

Complete examples for common use cases with the Strapi-NextGen Framework.

## Table of Contents

- [Basic Page](#basic-page)
- [Blog with Collection](#blog-with-collection)
- [Multilingual Site](#multilingual-site)
- [E-commerce Product Page](#e-commerce-product-page)
- [Global Components](#global-components)
- [Custom GraphQL Queries](#custom-graphql-queries)

---

## Basic Page

### Strapi Content Type

```json
{
  "kind": "singleType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page"
  },
  "attributes": {
    "slug": { "type": "string", "required": true, "unique": true },
    "title": { "type": "string", "required": true },
    "seo": { "type": "component", "repeatable": false, "component": "shared.seo" },
    "dynamicZone": { "type": "dynamiczone", "components": ["sections.hero", "sections.features"] }
  }
}
```

### Next.js Implementation

```typescript
// app/[slug]/page.tsx
import { strapiClient } from '@/lib/strapi';
import { generateStrapiMetadata, StrapiRenderer } from 'strapi-nextgen-framework';
import { componentMap } from '@/components/strapi';

interface PageProps {
  params: { slug: string };
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps) {
  const page = await strapiClient.getPage(params.slug);
  
  return generateStrapiMetadata(page.attributes.seo, {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  });
}

// Static Params (for SSG)
export async function generateStaticParams() {
  const pages = await strapiClient.getCollection('pages');
  
  return pages.map((page) => ({
    slug: page.attributes.slug,
  }));
}

// Page Component
export default async function Page({ params }: PageProps) {
  const page = await strapiClient.getPage(params.slug);
  
  return (
    <main>
      <h1>{page.attributes.title}</h1>
      <StrapiRenderer
        data={page.attributes.dynamicZone}
        map={componentMap}
        validation="warn"
      />
    </main>
  );
}
```

---

## Blog with Collection

### Strapi Content Type

```json
{
  "kind": "collectionType",
  "collectionName": "blog_posts",
  "info": {
    "singularName": "blog-post",
    "pluralName": "blog-posts",
    "displayName": "Blog Post"
  },
  "attributes": {
    "slug": { "type": "string", "required": true, "unique": true },
    "title": { "type": "string", "required": true },
    "excerpt": { "type": "text" },
    "publishedAt": { "type": "datetime" },
    "author": { "type": "relation", "relation": "manyToOne", "target": "api::author.author" },
    "coverImage": { "type": "media", "allowedTypes": ["images"] },
    "content": { "type": "dynamiczone", "components": ["content.rich-text", "content.image", "content.code"] },
    "seo": { "type": "component", "repeatable": false, "component": "shared.seo" }
  }
}
```

### Blog List Page

```typescript
// app/blog/page.tsx
import { strapiClient } from '@/lib/strapi';
import { StrapiImage } from 'strapi-nextgen-framework';
import Link from 'next/link';

export const metadata = {
  title: 'Blog',
  description: 'Read our latest articles',
};

export default async function BlogPage() {
  const posts = await strapiClient.getCollection('blogPosts', {
    sort: ['publishedAt:desc'],
    pagination: { pageSize: 10 },
  });
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="border rounded-lg overflow-hidden">
            <StrapiImage
              data={post.attributes.coverImage}
              nextImageProps={{
                className: 'w-full h-48 object-cover',
                width: 400,
                height: 200,
              }}
              fallback="/blog-placeholder.jpg"
            />
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.attributes.slug}`}>
                  {post.attributes.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4">{post.attributes.excerpt}</p>
              
              <time className="text-sm text-gray-500">
                {new Date(post.attributes.publishedAt).toLocaleDateString()}
              </time>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
```

### Blog Post Page

```typescript
// app/blog/[slug]/page.tsx
import { strapiClient } from '@/lib/strapi';
import { generateStrapiMetadata, StrapiRenderer, StrapiImage } from 'strapi-nextgen-framework';
import { componentMap } from '@/components/blog';

interface BlogPostProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostProps) {
  const post = await strapiClient.getCollection('blogPosts', {
    filters: { slug: { eq: params.slug } },
  });
  
  return generateStrapiMetadata(post[0].attributes.seo);
}

export async function generateStaticParams() {
  const posts = await strapiClient.getCollection('blogPosts');
  
  return posts.map((post) => ({
    slug: post.attributes.slug,
  }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const posts = await strapiClient.getCollection('blogPosts', {
    filters: { slug: { eq: params.slug } },
  });
  
  const post = posts[0];
  
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <StrapiImage
        data={post.attributes.coverImage}
        nextImageProps={{
          priority: true,
          className: 'w-full h-96 object-cover rounded-lg mb-8',
          width: 1200,
          height: 600,
        }}
      />
      
      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-4">{post.attributes.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-600">
          <time>{new Date(post.attributes.publishedAt).toLocaleDateString()}</time>
          <span>•</span>
          <span>{post.attributes.author.data.attributes.name}</span>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <StrapiRenderer
          data={post.attributes.content}
          map={componentMap}
          validation="warn"
        />
      </div>
    </article>
  );
}
```

---

## Multilingual Site

### SDK Configuration

```typescript
// lib/strapi.ts
import { createStrapiSDK } from 'strapi-nextgen-framework';

export const strapiClient = createStrapiSDK({
  url: process.env.STRAPI_URL!,
  token: process.env.STRAPI_TOKEN,
  defaultLocale: 'en', // Default locale
});
```

### Page with Locale

```typescript
// app/[locale]/[slug]/page.tsx
import { strapiClient } from '@/lib/strapi';
import { generateStrapiMetadata, StrapiRenderer } from 'strapi-nextgen-framework';
import { componentMap } from '@/components/strapi';

interface PageProps {
  params: { 
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const page = await strapiClient.getPage(params.slug, {
    locale: params.locale,
  });
  
  return generateStrapiMetadata(page.attributes.seo);
}

export async function generateStaticParams() {
  const locales = ['en', 'fr', 'es'];
  const params = [];
  
  for (const locale of locales) {
    const pages = await strapiClient.getCollection('pages', { locale });
    
    params.push(
      ...pages.map((page) => ({
        locale,
        slug: page.attributes.slug,
      }))
    );
  }
  
  return params;
}

export default async function Page({ params }: PageProps) {
  const page = await strapiClient.getPage(params.slug, {
    locale: params.locale,
  });
  
  return (
    <main>
      <StrapiRenderer
        data={page.attributes.dynamicZone}
        map={componentMap}
      />
    </main>
  );
}
```

---

## E-commerce Product Page

### Product Component

```typescript
// app/products/[slug]/page.tsx
import { strapiClient } from '@/lib/strapi';
import { StrapiImage } from 'strapi-nextgen-framework';

interface ProductProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductProps) {
  const products = await strapiClient.getCollection('products', {
    filters: { slug: { eq: params.slug } },
  });
  
  const product = products[0].attributes;
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.images.data[0].attributes.url],
    },
  };
}

export default async function ProductPage({ params }: ProductProps) {
  const products = await strapiClient.getCollection('products', {
    filters: { slug: { eq: params.slug } },
  });
  
  const product = products[0].attributes;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <StrapiImage
            data={product.images}
            nextImageProps={{
              priority: true,
              className: 'w-full rounded-lg',
              width: 600,
              height: 600,
            }}
          />
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <p className="text-3xl font-semibold text-blue-600 mb-6">
            ${product.price}
          </p>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
            Add to Cart
          </button>
          
          {/* Product Specifications */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
            <dl className="space-y-2">
              {product.specifications.map((spec) => (
                <div key={spec.id} className="flex">
                  <dt className="font-semibold w-1/3">{spec.name}:</dt>
                  <dd className="w-2/3">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Global Components

### Header with Navigation

```typescript
// components/Header.tsx
import { strapiClient } from '@/lib/strapi';
import Link from 'next/link';
import { StrapiImage } from 'strapi-nextgen-framework';

export async function Header() {
  const header = await strapiClient.getGlobal('header');
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <StrapiImage
            data={header.attributes.logo}
            nextImageProps={{
              width: 150,
              height: 50,
              alt: 'Logo',
            }}
          />
        </Link>
        
        {/* Navigation */}
        <nav>
          <ul className="flex gap-6">
            {header.attributes.navigation.map((item) => (
              <li key={item.id}>
                <Link 
                  href={item.url}
                  className="hover:text-blue-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

### Footer

```typescript
// components/Footer.tsx
import { strapiClient } from '@/lib/strapi';

export async function Footer() {
  const footer = await strapiClient.getGlobal('footer');
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footer.attributes.columns.map((column) => (
            <div key={column.id}>
              <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} className="hover:text-blue-400">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          {footer.attributes.copyright}
        </div>
      </div>
    </footer>
  );
}
```

---

## Custom GraphQL Queries

### Advanced Filtering

```typescript
// Custom query with rawQuery
const query = `
  query GetFeaturedPosts($limit: Int!) {
    blogPosts(
      filters: { featured: { eq: true } }
      sort: "publishedAt:desc"
      pagination: { limit: $limit }
    ) {
      data {
        id
        attributes {
          slug
          title
          excerpt
          publishedAt
          coverImage {
            data {
              attributes {
                url
                alternativeText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

const result = await strapiClient.rawQuery(query, { limit: 3 });
const featuredPosts = result.blogPosts.data;
```

### Search Functionality

```typescript
// app/search/page.tsx
import { strapiClient } from '@/lib/strapi';

interface SearchProps {
  searchParams: { q: string };
}

export default async function SearchPage({ searchParams }: SearchProps) {
  const query = `
    query Search($searchTerm: String!) {
      blogPosts(
        filters: {
          or: [
            { title: { containsi: $searchTerm } }
            { excerpt: { containsi: $searchTerm } }
          ]
        }
      ) {
        data {
          id
          attributes {
            slug
            title
            excerpt
          }
        }
      }
    }
  `;
  
  const result = await strapiClient.rawQuery(query, {
    searchTerm: searchParams.q,
  });
  
  const posts = result.blogPosts.data;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{searchParams.q}"
      </h1>
      
      {posts.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id}>
              <a href={`/blog/${post.attributes.slug}`} className="block hover:bg-gray-50 p-4 rounded">
                <h2 className="text-xl font-semibold">{post.attributes.title}</h2>
                <p className="text-gray-600">{post.attributes.excerpt}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Component Map Examples

### Rich Content Components

```typescript
// components/strapi/index.tsx
import { z } from 'zod';
import { RichText } from './RichText';
import { ImageBlock } from './ImageBlock';
import { CodeBlock } from './CodeBlock';
import { VideoEmbed } from './VideoEmbed';

export const componentMap = {
  'content.rich-text': {
    component: RichText,
    schema: z.object({
      __component: z.literal('content.rich-text'),
      content: z.string(),
    }),
  },
  'content.image': {
    component: ImageBlock,
    schema: z.object({
      __component: z.literal('content.image'),
      image: z.object({
        data: z.object({
          attributes: z.object({
            url: z.string(),
            alternativeText: z.string().optional(),
          }),
        }),
      }),
      caption: z.string().optional(),
    }),
  },
  'content.code': {
    component: CodeBlock,
    schema: z.object({
      __component: z.literal('content.code'),
      code: z.string(),
      language: z.string(),
    }),
  },
  'content.video-embed': {
    component: VideoEmbed,
    schema: z.object({
      __component: z.literal('content.video-embed'),
      url: z.string().url(),
      title: z.string().optional(),
    }),
  },
};
```

---

**More examples coming soon!** Check the [GitHub repository](https://github.com/DDevFurkanPasa/NextGen) for updates.
