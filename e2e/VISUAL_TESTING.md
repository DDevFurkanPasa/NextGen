# Visual Regression Testing Guide

## Overview

Visual regression testing automatically detects unintended visual changes in your application by comparing screenshots against baseline images.

## Quick Start

### 1. Create Baseline Screenshots

First time setup - creates baseline screenshots:

```bash
npm run test:e2e:visual:update
```

### 2. Run Visual Tests

Compare current state against baselines:

```bash
npm run test:e2e:visual
```

### 3. Debug Visual Tests

Step through tests interactively:

```bash
npm run test:e2e:visual:debug
```

## Test Coverage

### ✅ 75 Visual Tests Created

#### Page-Level Tests (6 tests × 5 browsers = 30 tests)
- Home page
- Test page (multiple components)
- Gallery page
- Blog page
- Error page
- Empty state page

#### Viewport Tests (3 viewports = 3 tests × 5 browsers = 15 tests)
- Mobile (375×667 - iPhone SE)
- Tablet (768×1024 - iPad)
- Desktop (1920×1080)

#### Dark Mode Tests (2 tests × 5 browsers = 10 tests)
- Home page dark mode
- Gallery dark mode

#### Component-Level Tests (2 tests × 5 browsers = 10 tests)
- Hero section
- Locale switcher

#### Responsive Tests (3 viewports × 5 browsers = 15 tests)
- Test page at mobile viewport
- Test page at tablet viewport
- Test page at desktop viewport

### Browser Coverage
- ✅ Chromium (Desktop Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## How It Works

### 1. Baseline Creation
```bash
npm run test:e2e:visual:update
```
- Captures screenshots of all pages/components
- Stores in `e2e/visual.spec.ts-snapshots/`
- Organized by browser (chromium, firefox, webkit, etc.)

### 2. Visual Comparison
```bash
npm run test:e2e:visual
```
- Captures new screenshots
- Compares pixel-by-pixel against baselines
- Fails if differences exceed threshold

### 3. Diff Generation
When tests fail:
- `*-actual.png` - Current screenshot
- `*-expected.png` - Baseline screenshot
- `*-diff.png` - Highlighted differences

## Configuration

### Thresholds (in `playwright.config.ts`)

```typescript
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100,      // Max 100 pixels can differ
    threshold: 0.2,          // 20% color difference allowed
    animations: 'disabled',  // Disable animations
  },
}
```

### Adjusting Sensitivity

**More strict** (catch small changes):
```typescript
maxDiffPixels: 10,
threshold: 0.1,
```

**More lenient** (ignore minor differences):
```typescript
maxDiffPixels: 500,
threshold: 0.5,
```

## Common Workflows

### Intentional UI Change

When you update CSS or components:

```bash
# 1. Make your changes
# 2. Run tests (will fail)
npm run test:e2e:visual

# 3. Review diffs in test-results/
# 4. If changes look correct, update baselines
npm run test:e2e:visual:update

# 5. Commit new baselines
git add e2e/visual.spec.ts-snapshots/
git commit -m "Update visual baselines for new button style"
```

### Detecting Regressions

```bash
# Run tests regularly
npm run test:e2e:visual

# If tests fail unexpectedly:
# 1. Check test-results/ for diff images
# 2. Identify the cause
# 3. Fix the CSS/component
# 4. Re-run tests
```

### Update Specific Snapshots

Update only specific tests:

```bash
# Update only home page
playwright test e2e/visual.spec.ts -g "home page" --update-snapshots

# Update only mobile snapshots
playwright test e2e/visual.spec.ts -g "mobile" --update-snapshots

# Update only dark mode
playwright test e2e/visual.spec.ts -g "dark mode" --update-snapshots
```

## Best Practices

### 1. ✅ Disable Animations
```typescript
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});
```

### 2. ✅ Wait for Network Idle
```typescript
await page.waitForLoadState('networkidle');
```

### 3. ✅ Hide Dynamic Content
```typescript
// Hide timestamps, random IDs, etc.
await page.addStyleTag({
  content: '.timestamp, .random-id { visibility: hidden; }',
});
```

### 4. ✅ Use Consistent Viewports
```typescript
await page.setViewportSize({ width: 1280, height: 720 });
```

### 5. ✅ Mask Dynamic Regions
```typescript
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.dynamic-content')],
});
```

## Troubleshooting

### Tests Fail on CI but Pass Locally

**Cause**: Font rendering differences between OS

**Solutions**:
1. Use Docker for consistent environment
2. Increase threshold:
   ```typescript
   threshold: 0.3, // More lenient
   ```
3. Generate baselines on CI

### Flaky Visual Tests

**Causes**:
- Animations not disabled
- Loading states
- Dynamic content (timestamps, random data)
- Network timing

**Solutions**:
1. Disable all animations
2. Wait for `networkidle`
3. Hide/mask dynamic content
4. Use stable test data

### Large Diff Files

**Cause**: Full-page screenshots of long pages

**Solution**: Use component-level snapshots or clip regions:
```typescript
await expect(page).toHaveScreenshot('page.png', {
  clip: { x: 0, y: 0, width: 1280, height: 720 },
});
```

### Font Rendering Differences

**Cause**: Different OS/browser font rendering

**Solutions**:
1. Use web fonts (not system fonts)
2. Increase threshold slightly
3. Generate baselines on same OS as CI

## CI/CD Integration

Visual tests run automatically in GitHub Actions:

```yaml
# .github/workflows/visual-regression.yml
- name: Run visual regression tests
  run: npm run test:e2e:visual

- name: Upload diff images on failure
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: visual-regression-diffs
    path: test-results/
```

### PR Comments

Failed visual tests automatically comment on PRs with diff artifacts.

## File Structure

```
e2e/
├── visual.spec.ts                    # Visual regression tests
├── visual/
│   └── README.md                     # Detailed documentation
└── visual.spec.ts-snapshots/         # Baseline screenshots
    ├── chromium/
    │   ├── home-page.png
    │   ├── test-page.png
    │   └── ...
    ├── firefox/
    ├── webkit/
    ├── Mobile-Chrome/
    └── Mobile-Safari/

test-results/                         # Generated on test failure
├── *-actual.png                      # Current screenshots
├── *-expected.png                    # Baseline screenshots
└── *-diff.png                        # Highlighted differences
```

## Git Workflow

### What to Commit
✅ **DO commit**: Baseline screenshots (`e2e/visual.spec.ts-snapshots/`)

### What to Ignore
❌ **DON'T commit**: 
- `test-results/` (test artifacts)
- `playwright-report/` (HTML reports)
- `*-actual.png` (current screenshots)
- `*-diff.png` (diff images)

These are already in `.gitignore`.

## Advanced Usage

### Custom Screenshot Options

```typescript
await expect(page).toHaveScreenshot('custom.png', {
  fullPage: true,              // Capture full scrollable page
  animations: 'disabled',      // Disable animations
  mask: [page.locator('.ad')], // Hide ads
  clip: { x: 0, y: 0, width: 800, height: 600 }, // Crop region
  maxDiffPixels: 50,           // Override threshold
  threshold: 0.1,              // Override color threshold
});
```

### Component-Level Snapshots

```typescript
// Test individual components
const hero = page.locator('[data-component="hero"]');
await expect(hero).toHaveScreenshot('hero.png');

const footer = page.locator('footer');
await expect(footer).toHaveScreenshot('footer.png');
```

### Multiple Viewports

```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  await page.setViewportSize(viewport);
  await expect(page).toHaveScreenshot(`page-${viewport.name}.png`);
}
```

## Resources

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Screenshot API](https://playwright.dev/docs/api/class-page#page-screenshot)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Need help?** Open an issue on [GitHub](https://github.com/DDevFurkanPasa/NextGen/issues)
