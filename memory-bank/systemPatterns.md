# System Patterns

## System Architecture

The framework follows a **two-layer architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Application                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Presentation Layer (Renderer)              │ │
│  │  - <StrapiRenderer /> (Dynamic Zone Renderer)      │ │
│  │  - <StrapiImage /> (Image Optimization)            │ │
│  │  - generateStrapiMetadata() (SEO Helper)           │ │
│  │  - Error Boundaries + Zod Validation               │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↕                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Data Layer (SDK)                      │ │
│  │  - createStrapiSDK() (Client Factory)              │ │
│  │  - Auto Cache Tagging (Next.js fetch wrapper)      │ │
│  │  - GraphQL Client (graphql-request)                │ │
│  │  - Type Generation (graphql-codegen)               │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↕                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Revalidation Handler (Webhook)             │ │
│  │  - createStrapiRevalidator() (API Route)           │ │
│  │  - Tag Mapping Logic                               │ │
│  │  - Secret Validation                               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↕
              ┌───────────────────────┐
              │   Strapi CMS (v4)     │
              │   - GraphQL API       │
              │   - Webhooks          │
              │   - Media Library     │
              └───────────────────────┘
```

### Architecture Type
**Library/SDK Pattern**: Not a full framework, but a collection of utilities and components that integrate into existing Next.js projects.

## Key Technical Decisions

### 1. GraphQL Over REST
**Decision**: Use GraphQL as the primary data fetching mechanism.
**Rationale**: 
- Eliminates REST's complex `populate` parameter
- Enables automatic type generation via `graphql-codegen`
- Provides precise data fetching (no over-fetching)
**Trade-off**: GraphQL queries may be slower to resolve on server-side, mitigated by ISR caching.

### 2. Automatic Cache Tagging
**Decision**: Wrap Next.js `fetch` API to automatically add revalidation tags.
**Rationale**:
- Developer doesn't need to think about cache management
- Query pattern determines the tag (e.g., `getPage('home')` → `strapi_page_home`)
- Enables instant on-demand revalidation
**Implementation**: SDK intercepts all queries and injects `next: { tags: [...] }` into fetch options.

### 3. Zod for Runtime Validation
**Decision**: Use Zod schemas for component prop validation.
**Rationale**:
- TypeScript provides compile-time safety, Zod provides runtime safety
- Catches corrupt CMS data before it crashes components
- Provides clear error messages in development
**Trade-off**: Adds runtime overhead, mitigated by conditional validation (dev-only strict mode).

### 4. Error Boundaries for Resilience
**Decision**: Wrap every dynamic component in React Error Boundary.
**Rationale**:
- Prevents single component failure from crashing entire page
- Production sites remain functional even with bad data
- Improves user experience and site reliability
**Implementation**: `<StrapiRenderer />` automatically wraps each component.

### 5. Adapter Pattern for Future-Proofing
**Decision**: Abstract Strapi communication behind adapter interface.
**Rationale**:
- Supports future Strapi versions (v5, v6) without breaking changes
- Allows switching between GraphQL and REST if needed
- Maintains clean separation of concerns
**Implementation**: `StrapiV4Adapter` implements `IStrapiAdapter` interface.

## Design Patterns

### 1. Factory Pattern
**Usage**: `createStrapiSDK()`, `createStrapiRevalidator()`, `createPreviewHandler()`
**Purpose**: Encapsulate complex initialization logic and provide clean API.

### 2. Adapter Pattern
**Usage**: `StrapiV4Adapter` implements `IStrapiAdapter`
**Purpose**: Abstract Strapi version-specific implementation details.

### 3. Wrapper Pattern
**Usage**: SDK wraps Next.js `fetch` to inject cache tags
**Purpose**: Transparently add functionality without changing API.

### 4. Component Composition Pattern
**Usage**: `<StrapiRenderer />` composes user-provided components
**Purpose**: Enable flexible, type-safe dynamic rendering.

### 5. Error Boundary Pattern
**Usage**: Automatic error boundaries around dynamic components
**Purpose**: Isolate failures and prevent cascading errors.

### 6. Escape Hatch Pattern
**Usage**: `rawQuery()` method for direct GraphQL access
**Purpose**: Provide flexibility when abstraction is limiting.

## Component Relationships

### Data Flow: Query Execution
```
Developer Code
    ↓ calls
strapiClient.getPage('home')
    ↓ generates
GraphQL Query + Variables
    ↓ wraps with
Auto Cache Tags (e.g., 'strapi_page_home')
    ↓ executes via
Next.js fetch() with tags
    ↓ sends to
Strapi GraphQL API
    ↓ returns
Typed Response (via codegen)
    ↓ validates (dev mode)
Zod Schema Check
    ↓ returns to
Developer Code
```

### Data Flow: Revalidation
```
Content Editor clicks "Publish" in Strapi
    ↓ triggers
Strapi Webhook (POST to /api/revalidate)
    ↓ received by
createStrapiRevalidator() handler
    ↓ validates
Webhook Secret
    ↓ extracts
Model Name from Payload
    ↓ maps via
tagMap configuration
    ↓ calls
revalidateTag('strapi_page_home')
    ↓ invalidates
Next.js Cache for that tag
    ↓ next request
Rebuilds page with fresh data
```

## Logging Strategy

### Development Mode
- **Zod Validation Errors**: Detailed error messages with schema expectations
- **Query Logging**: Log all GraphQL queries with variables (optional via config)
- **Cache Tag Logging**: Show which tags are being applied to each query
- **Revalidation Logging**: Log webhook receipts and tag invalidations

### Production Mode
- **Error Boundary Catches**: Log component failures to console.error
- **Webhook Failures**: Log failed revalidations (invalid secret, missing tags)
- **Silent Validation**: Skip Zod validation or log warnings without throwing

### Logging Levels
```typescript
// Configuration example
createStrapiSDK({
  logging: {
    queries: process.env.NODE_ENV === 'development',
    cacheTags: process.env.NODE_ENV === 'development',
    validation: 'warn', // 'error' | 'warn' | 'silent'
  }
})
```

## Error Handling Strategy

### Three-Tier Error Handling

#### 1. Development-Time Errors (Fail Fast)
- **Zod validation failures**: Throw errors with detailed messages
- **Missing required config**: Throw on SDK initialization
- **Invalid GraphQL queries**: Fail at codegen time

#### 2. Runtime Errors (Fail Safe)
- **Component render errors**: Caught by Error Boundary, log and skip component
- **Network failures**: Retry with exponential backoff, then return cached data
- **Invalid webhook payloads**: Log warning, return 400 status

#### 3. Data Errors (Graceful Degradation)
- **Missing optional fields**: Use default values or undefined
- **Corrupt image data**: Fallback to placeholder image
- **Missing translations**: Fallback to default locale

### Error Boundary Behavior
```typescript
// Production: Skip failed component, continue rendering
<ErrorBoundary fallback={null} onError={logToConsole}>
  <DynamicComponent />
</ErrorBoundary>

// Development: Show detailed error UI
<ErrorBoundary fallback={<ErrorDetails />} onError={throwError}>
  <DynamicComponent />
</ErrorBoundary>
```

### Retry Strategy
- **Network errors**: 3 retries with exponential backoff (1s, 2s, 4s)
- **Rate limiting**: Respect `Retry-After` header
- **Webhook revalidation**: No retry (fire-and-forget), log failure

---
*This document captures architectural patterns and technical decisions.*
*Created: 2025-11-04*
*Last Updated: 2025-11-04 15:15 UTC+03:00*
