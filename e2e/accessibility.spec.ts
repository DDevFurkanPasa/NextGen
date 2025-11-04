/**
 * Accessibility Tests using axe-core
 * 
 * Tests WCAG 2.1 Level A and AA compliance
 * Detects common accessibility issues like:
 * - Missing alt text
 * - Insufficient color contrast
 * - Missing ARIA labels
 * - Keyboard navigation issues
 * - Form accessibility
 */

import { test, expect } from './fixtures/test-app';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('home page should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('test page should not have accessibility violations', async ({ page }) => {
    await page.goto('/test-page');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('gallery page should not have accessibility violations', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('blog page should not have accessibility violations', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('error page should not have accessibility violations', async ({ page }) => {
    await page.goto('/error-test');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('empty state should not have accessibility violations', async ({ page }) => {
    await page.goto('/empty');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Accessibility - Keyboard Navigation', () => {
  test('should be able to navigate with keyboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName : null;
    });
    
    expect(focusedElement).toBeTruthy();
  });

  test('locale switcher should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const localeSwitcher = page.locator('[data-testid="locale-switcher"] button').first();
    
    // Focus the element
    await localeSwitcher.focus();
    
    // Check if it's focused
    const isFocused = await localeSwitcher.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
    
    // Should be activatable with Enter
    await page.keyboard.press('Enter');
  });
});

test.describe('Accessibility - ARIA Labels', () => {
  test('images should have alt text', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});

test.describe('Accessibility - Color Contrast', () => {
  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();
    
    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });
});

test.describe('Accessibility - Semantic HTML', () => {
  test('should use semantic HTML landmarks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();
    
    // Check for heading order violations
    const headingViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'heading-order'
    );
    
    expect(headingViolations).toEqual([]);
  });
});

test.describe('Accessibility - Focus Management', () => {
  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    // Check for focus-visible violations
    const focusViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes('focus')
    );
    
    expect(focusViolations).toEqual([]);
  });
});

test.describe('Accessibility - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile view should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('touch targets should be large enough', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Only check visible buttons in the main content, excluding browser/dev tool injected buttons
    const buttons = page.locator('main button, [data-testid] button').filter({ hasText: /.+/ });
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      const text = await button.textContent();
      
      if (box) {
        // WCAG 2.1 Level AAA: 44x44 pixels minimum
        // We'll use 44x44 as recommended
        expect(box.width, `Button "${text}" width`).toBeGreaterThanOrEqual(44);
        expect(box.height, `Button "${text}" height`).toBeGreaterThanOrEqual(44);
      }
    }
  });
});

test.describe('Accessibility - Screen Reader', () => {
  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have lang attribute on html', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });
});
