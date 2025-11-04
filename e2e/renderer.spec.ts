/**
 * E2E tests for StrapiRenderer component
 */

import { test, expect } from './fixtures/test-app';

test.describe('StrapiRenderer E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render page with dynamic zones', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/Test App/);
    
    // Check for rendered components
    const heroSection = page.locator('[data-component="hero"]');
    await expect(heroSection).toBeVisible();
  });

  test('should handle component mapping correctly', async ({ page }) => {
    // Navigate to a page with multiple components
    await page.goto('/test-page');
    
    // Verify multiple components render
    const components = page.locator('[data-component]');
    await expect(components).toHaveCount(3, { timeout: 5000 });
  });

  test('should display error boundary fallback on component error', async ({ page }) => {
    // Navigate to page with intentional error
    await page.goto('/error-test');
    
    // Check for error boundary fallback
    const errorFallback = page.locator('[data-testid="error-fallback"]');
    await expect(errorFallback).toBeVisible();
  });

  test('should handle empty data gracefully', async ({ page }) => {
    await page.goto('/empty');
    
    // Should show fallback or empty state
    const fallback = page.locator('[data-testid="no-content"]');
    await expect(fallback).toBeVisible();
  });
});
