# Visual Regression Testing

Visual regression testing captures screenshots of your application and compares them against baseline images to detect unintended visual changes.

## How It Works

1. **Baseline Creation**: First run creates baseline screenshots
2. **Comparison**: Subsequent runs compare against baselines
3. **Diff Detection**: Highlights pixel differences if changes detected
4. **Review**: Accept or reject visual changes

## Running Visual Tests

### Run Visual Tests

```bash
npm run test:e2e:visual
```

This compares current screenshots against baselines and fails if differences are detected.

### Update Baselines

When you intentionally change the UI:

```bash
npm run test:e2e:visual:update
```

This updates all baseline screenshots with current state.

### Debug Visual Tests

```bash
npm run test:e2e:visual:debug
```

Opens Playwright Inspector for step-by-step debugging.

## Test Coverage

### Pages Tested
- ✅ Home page
- ✅ Test page (multiple components)
- ✅ Gallery page
- ✅ Blog page
- ✅ Error page
- ✅ Empty state page

### Viewports Tested
- ✅ Mobile (375×667 - iPhone SE)
- ✅ Tablet (768×1024 - iPad)
- ✅ Desktop (1920×1080)

### Color Schemes
- ✅ Light mode
- ✅ Dark mode

### Component-Level Tests
- ✅ Hero section
- ✅ Locale switcher
- ✅ Individual components

## Screenshot Storage

Baseline screenshots are stored in:
```
e2e/visual.spec.ts-snapshots/
├── chromium/
│   ├── home-page.png
│   ├── test-page.png
│   └── ...
├── firefox/
└── webkit/
```

## Configuration

Visual regression settings in `playwright.config.ts`:

```typescript
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100,      // Max pixel differences allowed
    threshold: 0.2,          // Color difference threshold (0-1)
    animations: 'disabled',  // Disable animations for consistency
  },
}
```

## Best Practices

### 1. Disable Animations
Always disable animations for consistent screenshots:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});
```

### 2. Wait for Network Idle
Ensure page is fully loaded:

```typescript
await page.waitForLoadState('networkidle');
```

### 3. Hide Dynamic Content
Hide timestamps, random data, or dynamic content:

```typescript
await page.addStyleTag({
  content: '.timestamp { visibility: hidden; }',
});
```

### 4. Use Consistent Viewport
Set viewport size for consistent screenshots:

```typescript
await page.setViewportSize({ width: 1280, height: 720 });
```

### 5. Component-Level Snapshots
Test individual components:

```typescript
const component = page.locator('[data-component="hero"]');
await expect(component).toHaveScreenshot('hero.png');
```

## Handling Failures

When visual tests fail:

1. **Review the diff** - Check `test-results/` for diff images
2. **Investigate** - Determine if change is intentional
3. **Update or fix**:
   - If intentional: `npm run test:e2e:visual:update`
   - If bug: Fix the CSS/component and re-run

## Diff Images

Failed tests generate three images:
- `*-actual.png` - Current screenshot
- `*-expected.png` - Baseline screenshot
- `*-diff.png` - Highlighted differences

## CI/CD Integration

Visual tests run automatically in CI/CD:

```yaml
- name: Run visual regression tests
  run: npm run test:e2e:visual
  
- name: Upload diff images on failure
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: visual-diffs
    path: test-results/
```

## Ignoring Regions

Ignore dynamic regions:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.timestamp')],
});
```

## Cross-Browser Testing

Visual tests run on all configured browsers:
- Chromium
- Firefox
- WebKit

Each browser has its own baseline screenshots.

## Troubleshooting

### Tests fail on CI but pass locally

**Cause**: Font rendering differences between OS

**Solution**: Use Docker for consistent environment or increase threshold:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  threshold: 0.3, // More lenient
});
```

### Flaky visual tests

**Cause**: Animations, loading states, or dynamic content

**Solution**:
1. Disable animations
2. Wait for network idle
3. Hide dynamic content
4. Use stable test data

### Large diff files

**Cause**: Full-page screenshots of long pages

**Solution**: Use component-level snapshots or clip regions:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  clip: { x: 0, y: 0, width: 1280, height: 720 },
});
```

## Updating Specific Snapshots

Update only specific test snapshots:

```bash
# Update only home page snapshot
playwright test e2e/visual.spec.ts -g "home page" --update-snapshots

# Update only mobile snapshots
playwright test e2e/visual.spec.ts -g "mobile" --update-snapshots
```

## Resources

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

**Need help?** Open an issue on [GitHub](https://github.com/DDevFurkanPasa/NextGen/issues)
