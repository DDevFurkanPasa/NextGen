/**
 * Playwright fixtures for E2E tests
 * Provides utilities for testing the framework
 */

import { test as base } from '@playwright/test';

type TestFixtures = {
  // Add custom fixtures here if needed
};

export const test = base.extend<TestFixtures>({
  // Custom fixtures can be added here
});

export { expect } from '@playwright/test';
