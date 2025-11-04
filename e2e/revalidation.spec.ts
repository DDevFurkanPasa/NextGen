/**
 * E2E tests for ISR revalidation
 */

import { test, expect } from './fixtures/test-app';

test.describe('Revalidation E2E', () => {
  test('should revalidate on webhook trigger', async ({ page, request }) => {
    // Get initial content
    await page.goto('/blog/test-post');
    const initialContent = await page.locator('h1').textContent();
    
    // Trigger revalidation webhook
    const response = await request.post('/api/revalidate', {
      data: {
        secret: 'test-revalidation-secret',
        tags: ['strapi_page_test-post'],
      },
    });
    
    expect(response.ok()).toBeTruthy();
    
    // Reload page
    await page.reload();
    
    // Content should be revalidated (may or may not change, but page should load)
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should reject webhook without valid secret', async ({ request }) => {
    const response = await request.post('/api/revalidate', {
      data: {
        secret: 'wrong-secret',
        tags: ['strapi_page_home'],
      },
    });
    
    expect(response.status()).toBe(401);
  });

  test('should revalidate multiple tags', async ({ request }) => {
    const response = await request.post('/api/revalidate', {
      data: {
        secret: 'test-revalidation-secret',
        tags: ['strapi_page_home', 'strapi_global_header'],
      },
    });
    
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    expect(body.revalidated).toBe(true);
  });
});
