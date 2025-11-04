import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    
    // Only include unit and integration tests from src
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    
    // Exclude e2e tests (they use Playwright, not Vitest)
    exclude: [
      'node_modules',
      'dist',
      'e2e',
      'e2e/**',
      'coverage',
    ],
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'text-summary'],
      reportsDirectory: './coverage',
      
      // Include only source files
      include: ['src/**/*.{ts,tsx}'],
      
      // Exclude test files, types, and non-source code
      exclude: [
        'node_modules/',
        'dist/',
        'e2e/',
        'coverage/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/__tests__/**',
        '**/types.ts',
        '**/*.d.ts',
        'src/index.ts', // Entry point (just exports)
        'vitest.config.ts',
        'vitest.setup.ts',
      ],
      
      // Coverage thresholds (LOCKED AT CURRENT BASELINE - prevent regression)
      // Achieved: Statements 96.59%, Branches 94.52%, Functions 96%, Lines 96.59%
      // These thresholds will FAIL the build if coverage drops below current baseline
      thresholds: {
        lines: 96,        // Current: 96.59% - Locked to prevent regression
        functions: 95,    // Current: 96% - Locked to prevent regression
        branches: 94,     // Current: 94.52% - Locked to prevent regression
        statements: 96,   // Current: 96.59% - Locked to prevent regression
        // Per-file thresholds disabled (already at near-perfect coverage)
        perFile: false,
      },
      
      // Show uncovered lines
      all: true,
      skipFull: false,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
