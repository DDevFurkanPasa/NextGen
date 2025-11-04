/**
 * E2E tests for SEO metadata generation
 */

import { test, expect } from './fixtures/test-app';

test.describe('SEO Metadata E2E', () => {
  test('should generate correct meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check title exists
    await expect(page).toHaveTitle(/Test App/);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);
  });

  test('should include Twitter Card meta tags', async ({ page }) => {
    await page.goto('/blog/test-post');
    
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
    
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    await expect(twitterTitle).toHaveAttribute('content', /.+/);
  });

  test('should generate canonical URL', async ({ page }) => {
    await page.goto('/about');
    
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/about$/);
  });

  test('should include structured data', async ({ page }) => {
    await page.goto('/');
    
    // Check for JSON-LD structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount(1, { timeout: 3000 });
  });
});
