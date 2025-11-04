# Test App Routes

All routes created for E2E testing.

## Pages

| Route | Purpose | Test Coverage |
|-------|---------|---------------|
| `/` | Home page | Renderer, SDK, SEO, Structured Data |
| `/test-page` | Multiple components | Renderer component mapping |
| `/error-test` | Error boundary | Error handling |
| `/empty` | No content | Empty state handling |
| `/gallery` | Image gallery | Image optimization |
| `/long-gallery` | Long scrolling gallery | Lazy loading |
| `/missing-image` | Missing image fallback | Image error handling |
| `/blog` | Blog listing | SDK data fetching |
| `/blog/test-post` | Blog post | SEO metadata |
| `/about` | About page | Canonical URLs |
| `/invalid-query` | GraphQL error | Error handling |
| `/home` | Preview home | Preview mode |
| `/draft-post` | Draft content | Preview mode |

## API Routes

| Route | Purpose | Test Coverage |
|-------|---------|---------------|
| `/api/preview` | Enable preview mode | Preview activation |
| `/api/exit-preview` | Disable preview mode | Preview exit |
| `/api/revalidate` | ISR revalidation | Cache revalidation |

## Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `LocaleSwitcher` | `/components/LocaleSwitcher.tsx` | Locale switching for i18n tests |

## Test Data Attributes

- `data-testid="title"` - Page titles
- `data-testid="error-fallback"` - Error boundaries
- `data-testid="no-content"` - Empty states
- `data-testid="image-fallback"` - Image fallbacks
- `data-testid="error-message"` - Error messages
- `data-testid="preview-mode"` - Preview indicators
- `data-testid="draft-content"` - Draft content
- `data-testid="locale-switcher"` - Locale switcher
- `data-component="hero"` - Component mapping
- `data-strapi-image="true"` - Strapi images

## Environment Variables

Create `.env.local` in test-app:

```bash
# Not required for basic tests, but useful for real Strapi integration
STRAPI_URL=http://localhost:1337/graphql
STRAPI_TOKEN=your_token_here
```

## Running the Test App

```bash
cd e2e/test-app
npm run dev
```

Visit http://localhost:3000 to see the test app.

## Running E2E Tests

From project root:

```bash
npm run test:e2e
```

All routes are now available and tests should pass!
