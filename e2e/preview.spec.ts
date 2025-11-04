/**
 * E2E tests for preview mode
 */

import { test, expect } from './fixtures/test-app';

test.describe('Preview Mode E2E', () => {
  test('should enable preview mode with valid secret', async ({ page }) => {
    // Enable preview mode
    await page.goto('/api/preview?secret=test-secret&slug=home');
    
    // Should redirect to preview page
    await expect(page).toHaveURL(/\/home/);
    
    // Check for preview indicator
    const previewBanner = page.locator('[data-testid="preview-mode"]');
    await expect(previewBanner).toBeVisible();
  });

  test('should show draft content in preview mode', async ({ page }) => {
    // Enable preview
    await page.goto('/api/preview?secret=test-secret&slug=draft-post');
    
    // Should see draft content
    const draftIndicator = page.locator('[data-testid="draft-content"]');
    await expect(draftIndicator).toBeVisible();
  });

  test('should exit preview mode', async ({ page }) => {
    // Enable preview
    await page.goto('/api/preview?secret=test-secret&slug=home');
    
    // Exit preview
    await page.goto('/api/exit-preview');
    
    // Preview banner should be gone
    const previewBanner = page.locator('[data-testid="preview-mode"]');
    await expect(previewBanner).not.toBeVisible();
  });

  test('should reject invalid preview secret', async ({ page }) => {
    const response = await page.goto('/api/preview?secret=wrong-secret&slug=home');
    
    // Should return 401 or redirect to error
    expect(response?.status()).toBe(401);
  });
});
