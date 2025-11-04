# E2E Tests

End-to-end tests for the Strapi-NextGen Framework using Playwright.

## Prerequisites

1. **Test Next.js Application**: You need a Next.js app using the framework
2. **Strapi Instance** (optional): For full integration testing
3. **Playwright**: Installed via `npm install -D @playwright/test`

## Setup

### 1. Install Playwright Browsers

```bash
npx playwright install
```

### 2. Create Test Next.js App

Create a minimal Next.js app in `e2e/test-app/` directory:

```bash
cd e2e
npx create-next-app@latest test-app --typescript --tailwind --app --no-src-dir
cd test-app
npm install ../../ # Install the framework
```

### 3. Configure Environment

Copy `.env.e2e.example` to `.env.e2e` and configure:

```bash
cp .env.e2e.example .env.e2e
```

Edit `.env.e2e`:

```bash
E2E_BASE_URL=http://localhost:3000
E2E_APP_PATH=./e2e/test-app  # Optional: auto-start test app
STRAPI_URL=http://localhost:1337/graphql
STRAPI_TOKEN=your_test_token
PREVIEW_SECRET=test-secret
REVALIDATION_SECRET=test-revalidation-secret
```

### 4. Start Your Test App (If Not Auto-Starting)

If you don't set `E2E_APP_PATH`, manually start your test app:

```bash
cd e2e/test-app
npm run dev
```

Keep this running in a separate terminal.

## Running Tests

### Prerequisites

**IMPORTANT**: E2E tests require a running Next.js application. You have two options:

**Option A: Manual Start (Recommended for Development)**
```bash
# Terminal 1: Start your test app
cd e2e/test-app
npm run dev

# Terminal 2: Run tests
npm run test:e2e
```

**Option B: Auto-Start**
```bash
# Set E2E_APP_PATH in .env.e2e
E2E_APP_PATH=./e2e/test-app

# Tests will start the app automatically
npm run test:e2e
```

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npx playwright test e2e/renderer.spec.ts
```

### Run in UI Mode (Interactive)

```bash
npx playwright test --ui
```

### Run in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

```
e2e/
├── fixtures/
│   └── test-app.ts          # Custom Playwright fixtures
├── renderer.spec.ts         # StrapiRenderer component tests
├── sdk.spec.ts              # SDK data fetching tests
├── seo.spec.ts              # SEO metadata tests
├── image.spec.ts            # StrapiImage component tests
├── preview.spec.ts          # Preview mode tests
├── revalidation.spec.ts     # ISR revalidation tests
└── README.md                # This file
```

## Test Coverage

### ✅ Renderer Tests
- Component rendering
- Component mapping
- Error boundaries
- Empty data handling

### ✅ SDK Tests
- Data fetching
- Locale switching
- Caching behavior
- Error handling

### ✅ SEO Tests
- Meta tags generation
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Structured data

### ✅ Image Tests
- Image optimization
- Responsive images
- Fallback handling
- Lazy loading

### ✅ Preview Tests
- Preview mode activation
- Draft content display
- Preview exit
- Secret validation

### ✅ Revalidation Tests
- Webhook triggers
- Tag-based revalidation
- Secret validation
- Multiple tag revalidation

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from './fixtures/test-app';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/test-page');
    
    const element = page.locator('[data-testid="my-element"]');
    await expect(element).toBeVisible();
  });
});
```

### Using Custom Fixtures

```typescript
test('should use custom fixture', async ({ page, customFixture }) => {
  // Use your custom fixture
});
```

## Debugging Tests

### Debug Mode

```bash
npx playwright test --debug
```

### Generate Test Code

```bash
npx playwright codegen http://localhost:3000
```

### View Test Report

```bash
npx playwright show-report
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots
- Videos
- Traces

Find them in `test-results/` directory.

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Pull requests
- Pushes to main/develop
- Manual workflow dispatch

### GitHub Actions Configuration

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    E2E_BASE_URL: http://localhost:3000
```

## Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Wait for network idle** before assertions
3. **Test user flows**, not implementation details
4. **Keep tests independent** - no test should depend on another
5. **Use Page Object Model** for complex pages
6. **Mock external services** when appropriate
7. **Test responsive behavior** across viewports

## Troubleshooting

### Tests Timeout

Increase timeout in `playwright.config.ts`:

```typescript
use: {
  actionTimeout: 10000,
  navigationTimeout: 30000,
}
```

### Flaky Tests

- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use `toHaveCount` with timeout: `{ timeout: 5000 }`
- Retry failed tests: `retries: 2`

### Browser Not Found

```bash
npx playwright install chromium
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)

---

**Need help?** Open an issue on [GitHub](https://github.com/DDevFurkanPasa/NextGen/issues)
