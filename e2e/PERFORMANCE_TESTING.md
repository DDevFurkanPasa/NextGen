# Performance Testing

This directory contains performance and load testing suites for the Strapi NextGen Framework.

## ⚠️ Important Note: Lighthouse Tests

**The Lighthouse performance tests (`e2e/performance.spec.ts`) are currently SKIPPED by default** due to limitations with the `playwright-lighthouse` integration. The package requires Chrome with remote debugging enabled, which conflicts with Playwright's managed browser instances.

### Alternative: Use Lighthouse Directly

For performance testing, we recommend using Lighthouse against production builds. There are two easy options:

#### Option 1: Chrome DevTools Lighthouse (Recommended - Easiest)

1. Build and start production server:
   ```bash
   cd e2e/test-app
   npm run build
   npm run start
   ```

2. Open Chrome and navigate to: `http://localhost:3000`

3. Open DevTools (F12) → Click the **Lighthouse** tab → Click **Analyze page load**

4. Repeat for other pages: `/blog`, `/gallery`, etc.

✅ **Advantages**: No installation needed, visual reports, works immediately

#### Option 2: Lighthouse CLI

Lighthouse CLI requires Chrome/Chromium to be installed:

1. **Install Chrome** (if not already installed):
   - Download from: https://www.google.com/chrome/
   - Or use Edge (pre-installed on Windows)

2. Build and start production server:
   ```bash
   cd e2e/test-app
   npm run build
   npm run start
   ```

3. Install and run Lighthouse:
   ```bash
   npm install -g lighthouse
   lighthouse http://localhost:3000 --view
   lighthouse http://localhost:3000/blog --view
   lighthouse http://localhost:3000/gallery --view
   ```

**Note**: If you get "No Chrome installations found", install Google Chrome first. Playwright's Chromium is not detected by Lighthouse CLI.

Both options provide the same Core Web Vitals metrics (LCP, CLS, TTI) and performance scores.

## Overview

We use two types of performance testing:

1. **Lighthouse Performance Testing** - Measures Core Web Vitals and performance scores
2. **Load Testing** - Tests application behavior under concurrent load

## Lighthouse Performance Testing

### What is Tested

The Lighthouse tests measure:

- **Performance Score** (0-100): Overall page performance
- **Accessibility Score** (0-100): Accessibility compliance (also covered in accessibility.spec.ts)
- **Best Practices Score** (0-100): Modern web best practices
- **SEO Score** (0-100): Search engine optimization

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: Time until the largest content element is rendered
  - Good: < 2.5s
  - Needs Improvement: 2.5-4s
  - Poor: > 4s

- **FID (First Input Delay)**: Time from user interaction to browser response
  - Good: < 100ms
  - Needs Improvement: 100-300ms
  - Poor: > 300ms

- **CLS (Cumulative Layout Shift)**: Visual stability during page load
  - Good: < 0.1
  - Needs Improvement: 0.1-0.25
  - Poor: > 0.25

- **TTI (Time to Interactive)**: Time until the page is fully interactive
  - Goal: < 5s

### Running Performance Tests

```bash
# Run all performance tests
npm run test:e2e:perf

# Run in debug mode
npm run test:e2e:perf:debug

# Run specific test
npx playwright test e2e/performance.spec.ts --grep "home page"
```

### Performance Thresholds

#### Desktop
- Performance: ≥ 75
- Accessibility: ≥ 90
- Best Practices: ≥ 80
- SEO: ≥ 90

#### Mobile
- Performance: ≥ 65 (mobile is typically slower)
- Accessibility: ≥ 90
- Best Practices: ≥ 80
- SEO: ≥ 90

#### Image-Heavy Pages (Gallery)
- Performance: ≥ 70 (adjusted for image loading)

### Prerequisites

Performance tests require Lighthouse to be installed:

```bash
npm install --save-dev lighthouse playwright-lighthouse
```

The tests also require Chrome to be running with remote debugging enabled on port 9222.

### Interpreting Results

Lighthouse scores are displayed in the console:

```
Desktop Performance Scores: {
  performance: 0.92,    // 92/100 - Good
  accessibility: 0.95,  // 95/100 - Good
  bestPractices: 0.88,  // 88/100 - Needs Improvement
  seo: 0.93            // 93/100 - Good
}
```

## Load Testing

### What is Tested

Load tests verify that the application:

1. Handles multiple concurrent users
2. Maintains performance under stress
3. Doesn't have memory leaks
4. Handles rapid navigation
5. Manages concurrent API requests

### Test Scenarios

#### Concurrent Users (10 users)
- Simulates 10 users loading the home page simultaneously
- Measures: Average load time, max load time
- **Dev Mode Thresholds**: Avg < 12s, Max < 15s
- **Production Thresholds**: Avg < 5s, Max < 10s

#### Rapid Sequential Requests
- Loads multiple pages in quick succession
- Ensures consistent performance across routes
- **Dev Mode Threshold**: Each page < 10s
- **Production Threshold**: Each page < 5s

#### Concurrent API Requests (20 requests)
- Makes 20 simultaneous requests to the API
- Measures: Success rate, average response time
- **Dev Mode Thresholds**: 100% success, avg < 5s
- **Production Thresholds**: 100% success, avg < 2s

#### Memory Stability (10 iterations)
- Loads the same page 10 times
- Checks for performance degradation
- **Threshold**: < 50% degradation between first and second half
- **Timeout**: 60s (accommodates slower environments)

#### Rapid Navigation (10 page loads)
- Quickly navigates between pages
- Ensures no JavaScript errors occur (ignores dev mode warnings)
- **Threshold**: 0 critical errors
- **Timeout**: 60s (accommodates slower environments)

#### Stress Test (15 concurrent users)
- Tests with 15 users accessing different pages
- Verifies system stability under heavy load
- **Dev Mode Thresholds**: 90% success, avg < 15s, max < 25s
- **Production Thresholds**: 100% success, avg < 8s, max < 15s

### Running Load Tests

```bash
# Run all load tests
npm run test:e2e:load

# Run in debug mode
npm run test:e2e:load:debug

# Run specific test
npx playwright test e2e/load.spec.ts --grep "concurrent users"
```

### Interpreting Results

Load test results show detailed metrics:

```
Concurrent Load Test Results:
Total time for 10 users: 3245ms
Individual load times:
  User 1: 2840ms
  User 2: 2910ms
  ...
Average load time: 2876ms
Max load time: 3120ms
```

## CI/CD Integration

Both performance and load tests can be integrated into CI/CD:

```yaml
# GitHub Actions example
- name: Run Performance Tests
  run: npm run test:e2e:perf
  
- name: Run Load Tests
  run: npm run test:e2e:load
```

**Note**: Performance tests may need to be run separately from standard E2E tests due to:
- Longer execution time
- Lighthouse port requirements
- Resource-intensive operations

## Troubleshooting

### Lighthouse Tests Failing

**Issue**: "Cannot connect to Chrome on port 9222"

**Solution**: Lighthouse requires Chrome with remote debugging. The test will handle this automatically in most cases, but you may need to:

```bash
# Start Chrome manually with remote debugging
chrome --remote-debugging-port=9222
```

**Issue**: Performance scores are lower than expected

**Solution**: 
- Ensure the Next.js app is running in production mode: `npm run build && npm run start`
- Development mode has additional overhead (hot reload, dev tools)
- Close other browser tabs and applications
- Run tests on a consistent network connection

### Load Tests Failing

**Issue**: Tests timeout or fail intermittently

**Solution**:
- Increase timeout in playwright.config.ts
- Reduce concurrent user count in tests
- Ensure system has sufficient resources

**Issue**: High load times in load tests

**Solution**:
- **Development Mode**: Tests run against `npm run dev` which has significant overhead (HMR, Fast Refresh, source maps). This is normal and expected.
- **Production Testing**: For accurate performance metrics, build and run in production mode:
  ```bash
  cd e2e/test-app
  npm run build
  npm run start
  ```
  Then run load tests against the production build.
- Check if the Next.js dev server is overwhelmed
- Monitor system resources (CPU, memory)

**Issue**: Load test thresholds too strict

**Solution**:
- Tests use different thresholds for dev vs production mode
- Dev mode: 2-3x slower than production (12s avg vs 5s avg for concurrent loads)
- If consistently exceeding thresholds, consider:
  - Closing background applications
  - Running on a more powerful machine
  - Adjusting thresholds in `e2e/load.spec.ts` if your environment requires it

## Best Practices

1. **Run in Production Mode**: Always test against a production build
2. **Consistent Environment**: Run tests in a consistent environment (same machine, network)
3. **Baseline Metrics**: Establish baseline metrics for your application
4. **Regular Monitoring**: Run performance tests regularly to catch regressions
5. **Realistic Scenarios**: Adjust concurrent user counts to match expected traffic
6. **CI/CD Thresholds**: Set appropriate thresholds for automated testing

## Further Reading

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Playwright Performance Testing](https://playwright.dev/docs/test-performance)
- [Next.js Performance Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)
