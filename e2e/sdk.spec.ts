/**
 * E2E tests for SDK data fetching
 */

import { test, expect } from './fixtures/test-app';

test.describe('SDK E2E', () => {
  test('should fetch and display page data', async ({ page }) => {
    await page.goto('/');
    
    // Wait for data to load
    await page.waitForLoadState('networkidle');
    
    // Check if content from Strapi is displayed
    const content = page.locator('main');
    await expect(content).toBeVisible();
    await expect(content).not.toBeEmpty();
  });

  test('should handle locale switching', async ({ page }) => {
    await page.goto('/');
    
    // Switch locale
    const localeSwitch = page.locator('[data-testid="locale-switcher"]');
    if (await localeSwitch.isVisible()) {
      await localeSwitch.click();
      await page.locator('[data-locale="fr"]').click();
      
      // Verify locale changed
      await expect(page).toHaveURL(/locale=fr/);
    }
  });

  test('should cache and revalidate data', async ({ page }) => {
    // First visit
    await page.goto('/blog');
    const firstLoadTime = Date.now();
    await page.waitForLoadState('networkidle');
    const firstDuration = Date.now() - firstLoadTime;
    
    // Second visit (should be cached)
    await page.goto('/');
    await page.goto('/blog');
    const secondLoadTime = Date.now();
    await page.waitForLoadState('networkidle');
    const secondDuration = Date.now() - secondLoadTime;
    
    // Cached load should be faster
    expect(secondDuration).toBeLessThan(firstDuration);
  });

  test('should handle GraphQL errors gracefully', async ({ page }) => {
    // Navigate to page that triggers GraphQL error
    await page.goto('/invalid-query');
    
    // Should show error state, not crash
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
  });
});
