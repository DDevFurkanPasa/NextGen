# E2E Test Setup Guide

This guide walks you through setting up E2E tests for the Strapi-NextGen Framework.

## Why E2E Tests Need a Test App

E2E tests simulate real user interactions in a browser. They need an actual Next.js application running that uses the framework. This is different from unit tests which test code in isolation.

## Quick Setup (5 Minutes)

### Step 1: Install Playwright

```bash
npx playwright install
```

### Step 2: Create a Test Next.js App

```bash
# From project root
cd e2e

# Create Next.js app
npx create-next-app@latest test-app --typescript --tailwind --app --no-src-dir

# Install the framework
cd test-app
npm install ../../
```

### Step 3: Configure the Test App

Create `e2e/test-app/app/page.tsx`:

```tsx
import { createStrapiSDK } from 'strapi-nextgen-framework';

const strapi = createStrapiSDK({
  strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337/graphql',
  cache: { enabled: true },
});

export default async function Home() {
  return (
    <main>
      <h1>Test App</h1>
      <div data-component="hero">
        <p>Framework is working!</p>
      </div>
    </main>
  );
}
```

Create `e2e/test-app/.env.local`:

```bash
STRAPI_URL=http://localhost:1337/graphql
```

### Step 4: Test the App Works

```bash
cd e2e/test-app
npm run dev
```

Visit http://localhost:3000 - you should see "Test App" and "Framework is working!"

### Step 5: Run E2E Tests

Keep the dev server running, then in a new terminal:

```bash
# From project root
npm run test:e2e
```

## Alternative: Mock Strapi Data

If you don't have a Strapi instance, you can mock the data:

```tsx
// e2e/test-app/app/page.tsx
export default function Home() {
  // Mock data instead of fetching from Strapi
  const mockData = [
    {
      __component: 'sections.hero',
      title: 'Welcome',
      subtitle: 'Test content',
    },
  ];

  return (
    <main>
      <h1>Test App</h1>
      {mockData.map((item, i) => (
        <div key={i} data-component={item.__component}>
          <h2>{item.title}</h2>
          <p>{item.subtitle}</p>
        </div>
      ))}
    </main>
  );
}
```

## Minimal Test App Structure

```
e2e/test-app/
├── app/
│   ├── page.tsx              # Home page
│   ├── test-page/
│   │   └── page.tsx          # Test page with multiple components
│   ├── error-test/
│   │   └── page.tsx          # Page that triggers errors
│   ├── empty/
│   │   └── page.tsx          # Page with no content
│   └── layout.tsx            # Root layout
├── .env.local                # Environment variables
├── package.json
└── next.config.js
```

## Running Tests Without a Test App

If you just want to see the test structure without running them:

```bash
# Use UI mode (won't try to start server)
npm run test:e2e:ui
```

This opens the Playwright UI where you can browse tests without executing them.

## Troubleshooting

### "Missing script: dev:e2e"

**Solution**: The test app needs to be started manually or via `E2E_APP_PATH` environment variable.

```bash
# Option 1: Start manually
cd e2e/test-app && npm run dev

# Option 2: Set in .env.e2e
E2E_APP_PATH=./e2e/test-app
```

### "Cannot find module 'strapi-nextgen-framework'"

**Solution**: Install the framework in your test app:

```bash
cd e2e/test-app
npm install ../../
```

### "Connection refused" or "net::ERR_CONNECTION_REFUSED"

**Solution**: Make sure your test app is running on the correct port:

```bash
cd e2e/test-app
npm run dev
# Should show: Local: http://localhost:3000
```

### Tests fail with "Timeout waiting for element"

**Solution**: Your test app might not have the expected elements. Check that your test pages have the correct `data-testid` or `data-component` attributes that tests are looking for.

## Next Steps

1. ✅ Create test app
2. ✅ Run basic tests
3. Add more test pages
4. Add Strapi integration
5. Customize tests for your use case

## Need Help?

- See full documentation: `e2e/README.md`
- Check test examples: `e2e/*.spec.ts`
- Open an issue: [GitHub Issues](https://github.com/DDevFurkanPasa/NextGen/issues)
