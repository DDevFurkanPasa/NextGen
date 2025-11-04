/**
 * E2E tests for StrapiImage component
 */

import { test, expect } from './fixtures/test-app';

test.describe('StrapiImage E2E', () => {
  test('should render optimized images', async ({ page }) => {
    await page.goto('/gallery');
    
    // Check if images are rendered
    const images = page.locator('img[data-strapi-image]');
    await expect(images.first()).toBeVisible();
    
    // Verify images have proper attributes
    const firstImage = images.first();
    const src = await firstImage.getAttribute('src');
    const width = await firstImage.getAttribute('width');
    const height = await firstImage.getAttribute('height');
    
    expect(src).toBeTruthy();
    expect(width).toBeTruthy();
    expect(height).toBeTruthy();
  });

  test('should use responsive images', async ({ page }) => {
    await page.goto('/gallery');
    
    const image = page.locator('img[data-strapi-image]').first();
    await expect(image).toBeVisible();
    
    // Check that image has proper dimensions
    const width = await image.getAttribute('width');
    const height = await image.getAttribute('height');
    
    expect(width).toBe('200');
    expect(height).toBe('200');
  });

  test('should show fallback for missing images', async ({ page }) => {
    await page.goto('/missing-image');
    
    // Check for fallback image or placeholder
    const fallback = page.locator('[data-testid="image-fallback"]');
    await expect(fallback).toBeVisible();
  });

  test('should lazy load images', async ({ page }) => {
    await page.goto('/long-gallery');
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for lazy-loaded images
    await page.waitForTimeout(1000);
    
    const images = page.locator('img[data-strapi-image]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });
});
