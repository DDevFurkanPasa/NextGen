# Product Context

## Why This Project Exists

Integrating Strapi (Headless CMS) with Next.js is powerful but complex. Developers face:
- Type-unsafe data from CMS (`any` types everywhere)
- Complex `populate` queries in REST API
- Manual cache management and revalidation setup
- Boilerplate code for common patterns (SEO, images, dynamic zones)
- Silent failures when CMS data is corrupt or missing
- Difficult preview mode implementation

The NextGen Framework exists to make Strapi + Next.js integration **type-safe, performant, and delightful** by default.

## Problems It Solves

### 1. Type Safety Problem
**Problem**: Strapi returns untyped JSON, leading to runtime errors and poor DX.
**Solution**: Automatic TypeScript type generation from GraphQL schemas via `graphql-codegen`.

### 2. Query Complexity Problem
**Problem**: REST API's `populate` parameter is confusing and verbose.
**Solution**: GraphQL-first approach with encapsulated queries and generated SDK.

### 3. Cache Management Problem
**Problem**: Developers must manually implement ISR tags and revalidation logic.
**Solution**: Automatic cache tagging based on query patterns + plug-and-play webhook handler.

### 4. Content Update Delay Problem
**Problem**: Changes in Strapi don't reflect on the site until manual revalidation.
**Solution**: On-demand revalidation via Strapi webhooks with automatic tag mapping.

### 5. Resilience Problem
**Problem**: Missing or corrupt CMS data crashes entire pages.
**Solution**: Zod validation + Error Boundaries to isolate component failures.

### 6. Boilerplate Problem
**Problem**: Repetitive code for SEO metadata, image optimization, dynamic zones.
**Solution**: Pre-built helpers: `generateStrapiMetadata`, `<StrapiImage />`, `<StrapiRenderer />`.

## Target Users

### Primary: Full-Stack JavaScript Developers
- Building marketing websites, blogs, or content-heavy applications
- Using Strapi as headless CMS and Next.js as frontend
- Value type safety and developer experience
- Want performance without complexity

### Secondary: Agencies and Teams
- Delivering multiple Strapi + Next.js projects
- Need standardized patterns and best practices
- Require fast onboarding for new developers
- Want maintainable, resilient codebases

## User Stories

### As a Developer
1. **I want** automatic TypeScript types from my Strapi schema **so that** I get autocomplete and type checking in my IDE.

2. **I want** simple query methods like `strapiClient.getPage('home')` **so that** I don't have to write complex GraphQL or REST queries.

3. **I want** automatic cache revalidation when content is published **so that** my site updates instantly without manual intervention.

4. **I want** my site to stay online even if a CMS component has corrupt data **so that** one bad entry doesn't crash the entire page.

5. **I want** pre-built components for common patterns (SEO, images, dynamic zones) **so that** I can focus on business logic instead of boilerplate.

### As a Content Editor (Indirect User)
1. **I want** to see my changes reflected immediately after clicking "Publish" **so that** I can verify my work without waiting.

2. **I want** to preview draft content on the live site **so that** I can review before publishing.

## User Experience Goals

### For Developers (Primary UX)

1. **Minimal Setup**: Get started with < 10 lines of configuration code
2. **Type Safety Everywhere**: Zero `any` types in application code
3. **Intuitive APIs**: Method names that match mental models (`getPage`, `getCollection`, `getGlobal`)
4. **Helpful Errors**: Clear validation messages in development mode
5. **Escape Hatches**: Always provide `rawQuery()` for advanced use cases
6. **Performance by Default**: No manual cache configuration needed

### For Content Editors (Secondary UX)

1. **Instant Updates**: Changes appear on site within seconds of publishing
2. **Preview Mode**: See drafts on live site before publishing
3. **Confidence**: Site remains stable even with data entry mistakes

### Developer Experience Principles

- **Convention over Configuration**: Smart defaults, minimal config
- **Progressive Disclosure**: Simple API surface, advanced features available when needed
- **Fail Fast in Dev, Fail Safe in Prod**: Strict validation in development, graceful degradation in production
- **Documentation as Code**: TypeScript types serve as inline documentation

---
*This document defines the product vision and user needs.*
*Created: 2025-11-04*
*Last Updated: 2025-11-04 15:15 UTC+03:00*
