# Changelog

All notable changes to the Strapi-NextGen Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-04

### 🎉 Initial Release

The first production-ready release of Strapi-NextGen Framework! A complete, type-safe solution for integrating Strapi v4 CMS with Next.js 14+ App Router.

### Added

#### Data Layer (SDK)
- **`createStrapiSDK()`** - Factory function for creating SDK instances
- **Automatic Cache Tagging** - Built-in cache tag generation for Next.js ISR
- **GraphQL Client** - Lightweight GraphQL client with `graphql-request`
- **Query Methods**:
  - `getPage()` - Fetch single pages by slug
  - `getCollection()` - Fetch collections with filters, sorting, pagination
  - `getGlobal()` - Fetch global singletons
  - `rawQuery()` - Escape hatch for custom GraphQL queries
- **i18n Support** - Full internationalization with locale parameter
- **Draft Mode Detection** - Automatic preview mode integration
- **Configurable Logging** - Query and cache tag logging for debugging

#### Presentation Layer (Renderer)
- **`<StrapiRenderer />`** - React component for dynamic zone rendering
- **Component Mapping** - Declarative component-to-type mapping
- **Error Boundaries** - Individual error boundaries per component
- **Zod Validation** - Runtime validation with 3 modes (error, warn, silent)
- **Development Error UI** - Detailed error messages with stack traces
- **Production Graceful Degradation** - Silent failures or fallback UI
- **Custom Error Callbacks** - Hook into errors for logging/tracking

#### Advanced Features
- **`generateStrapiMetadata()`** - SEO metadata generator for Next.js
  - Open Graph tags
  - Twitter Card tags
  - Canonical URLs
  - Robots meta tags
  - Structured data support
- **`<StrapiImage />`** - Optimized image component
  - next/image integration
  - Automatic width/height extraction
  - Fill mode support
  - Fallback images
- **`createStrapiRevalidator()`** - Webhook handler for on-demand ISR
  - Bearer token authentication
  - Automatic tag generation
  - Custom tag mapping
  - Error handling
- **`createPreviewHandler()`** - Preview mode enabler for draft content
- **`createExitPreviewHandler()`** - Preview mode disabler

#### Documentation
- Comprehensive README with quick start guide
- Complete API reference for all features
- Migration guide from manual Strapi + Next.js setup
- Real-world usage examples (blog, e-commerce, multilingual)
- Before/after code comparisons
- Troubleshooting guide

#### Developer Experience
- Full TypeScript support with exported types
- JSDoc comments on all public APIs
- Tree-shakeable exports (ESM + CJS)
- Zero-config defaults with opt-in customization
- Detailed error messages in development
- Performance-optimized for production

### Technical Details

- **Bundle Formats**: CommonJS and ES Modules
- **Peer Dependencies**: 
  - Next.js 14+
  - React 18+
  - Strapi v4 with GraphQL plugin
- **Dependencies**:
  - `graphql` - GraphQL query language
  - `graphql-request` - Lightweight GraphQL client
  - `zod` - Runtime validation
- **Build System**: TypeScript compiler with dual output
- **Code Quality**: ESLint + Prettier configured

### Architecture

- **Two-Layer Design**: Data Layer (SDK) + Presentation Layer (Renderer)
- **Design Patterns**: Factory, Adapter, Wrapper, Error Boundary, Escape Hatch
- **Cache Strategy**: Automatic tag generation with pattern `strapi_{type}_{identifier}_{locale?}`
- **Error Handling**: Three-tier approach (validation, boundaries, logging)

### Performance

- Automatic cache tagging for instant revalidation
- Tree-shakeable exports for minimal bundle size
- Optional validation in production for zero overhead
- Efficient GraphQL queries over REST API

### Breaking Changes

None - this is the initial release.

### Migration

For users migrating from manual Strapi + Next.js setups, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

### Known Issues

None currently reported.

### Credits

Developed with ❤️ by fuqom (@DDevFurkanPasa)

---

## [Unreleased]

### Planned Features
- Unit tests for SDK functions
- Integration tests for Strapi connection
- Component tests for renderer
- CI/CD pipeline
- Additional examples and templates

---

**Full Changelog**: https://github.com/DDevFurkanPasa/NextGen/commits/v0.1.0
