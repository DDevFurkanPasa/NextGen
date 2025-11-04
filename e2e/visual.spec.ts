/**
 * Visual Regression Tests
 * 
 * These tests capture screenshots and compare them against baseline images.
 * Run `npm run test:e2e:visual:update` to update baseline screenshots.
 */

import { test, expect } from './fixtures/test-app';

test.describe('Visual Regression Tests', () => {
  test('home page should match snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('test page with components should match snapshot', async ({ page }) => {
    await page.goto('/test-page');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('test-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('gallery page should match snapshot', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('gallery-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('blog page should match snapshot', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('blog-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('error page should match snapshot', async ({ page }) => {
    await page.goto('/error-test');
    await page.waitForLoadState('networkidle');
    
    // Wait for error to render
    await page.waitForSelector('[data-testid="error-fallback"]', { timeout: 3000 });
    
    await expect(page).toHaveScreenshot('error-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('empty state should match snapshot', async ({ page }) => {
    await page.goto('/empty');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('empty-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mobile viewport should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('home-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('tablet viewport should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('home-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('component-level snapshot - hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const heroSection = page.locator('[data-component="hero"]');
    await expect(heroSection).toHaveScreenshot('hero-component.png', {
      animations: 'disabled',
    });
  });

  test('component-level snapshot - locale switcher', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const localeSwitcher = page.locator('[data-testid="locale-switcher"]');
    await expect(localeSwitcher).toHaveScreenshot('locale-switcher.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test.use({ colorScheme: 'dark' });

  test('home page dark mode should match snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('home-page-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('gallery dark mode should match snapshot', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('gallery-page-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Responsive Components', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`test page at ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/test-page');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`test-page-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
