# Code Coverage Report

This document explains the code coverage infrastructure for the Strapi-NextGen Framework.

## Current Coverage Status

```
Statements   : 37.68% ( 398/1056 )
Branches     : 83.07% ( 54/65 )
Functions    : 47.61% ( 10/21 )
Lines        : 37.68% ( 398/1056 )
```

### Coverage by Module

| Module | Statements | Branches | Functions | Lines | Priority |
|--------|------------|----------|-----------|-------|----------|
| **SDK - Cache Tags** | 100% | 100% | 100% | 100% | ✅ Excellent |
| **SDK - Fetch Wrapper** | 70.37% | 100% | 100% | 70.37% | ⚠️ Good |
| **SDK - Index** | 36.78% | 100% | 14.28% | 36.78% | 🔴 Needs Work |
| **Renderer - Core** | 91.26% | 84.37% | 100% | 91.26% | ✅ Excellent |
| **Renderer - Error Boundary** | 66.66% | 81.81% | 100% | 66.66% | ⚠️ Good |
| **Renderer - Validator** | 86.36% | 100% | 50% | 86.36% | ✅ Good |
| **Components - StrapiImage** | 0% | 0% | 0% | 0% | 🔴 No Tests |
| **Helpers - Metadata** | 0% | 0% | 0% | 0% | 🔴 No Tests |
| **Preview** | 0% | 0% | 0% | 0% | 🔴 No Tests |
| **Revalidation** | 0% | 0% | 0% | 0% | 🔴 No Tests |

## Coverage Thresholds

Current thresholds are set to baseline levels to prevent regression:

```typescript
{
  lines: 35%,        // Current: 37.68% → Target: 80%
  functions: 45%,    // Current: 47.61% → Target: 80%
  branches: 80%,     // Current: 83.07% → Target: 85%
  statements: 35%,   // Current: 37.68% → Target: 80%
}
```

### Threshold Goals

- **Short-term (v0.2.0)**: 50% statements, 50% lines, 50% functions
- **Mid-term (v0.5.0)**: 65% statements, 65% lines, 65% functions
- **Long-term (v1.0.0)**: 80% statements, 80% lines, 80% functions, 75% branches

## Running Coverage Reports

### Basic Coverage Report

```bash
npm run test:coverage
```

Outputs:
- Terminal summary
- HTML report in `coverage/index.html`
- JSON report in `coverage/coverage-final.json`
- LCOV report in `coverage/lcov.info`

### Interactive Coverage UI

```bash
npm run test:coverage:ui
```

Opens Vitest UI with interactive coverage visualization.

### Watch Mode with Coverage

```bash
npm run test:coverage:watch
```

Runs tests in watch mode and updates coverage on file changes.

### Open HTML Report

```bash
npm run test:coverage:report
```

Generates coverage and automatically opens the HTML report in your browser.

## Viewing Coverage Reports

### HTML Report

The HTML report provides:
- File-by-file coverage breakdown
- Line-by-line coverage visualization
- Uncovered line highlighting
- Interactive navigation

**Location**: `coverage/index.html`

### Terminal Report

The terminal shows:
- Overall coverage percentages
- Per-file coverage summary
- Threshold pass/fail status

### LCOV Report

For CI/CD integration and tools like Codecov, Coveralls:

**Location**: `coverage/lcov.info`

## Coverage Configuration

Coverage is configured in `vitest.config.ts`:

```typescript
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
    'src/index.ts',
  ],
  
  thresholds: {
    lines: 35,
    functions: 45,
    branches: 80,
    statements: 35,
  },
}
```

## Priority Testing Areas

To improve coverage, focus on these high-impact, untested modules:

### 1. 🔴 **StrapiImage Component** (0% coverage)

**File**: `src/components/StrapiImage.tsx`

**Why Important**: Core component for image optimization

**Test Coverage Needed**:
- Image URL generation
- Responsive srcset generation
- Format conversion (WebP, AVIF)
- Lazy loading
- Error handling

**Estimated Impact**: +9% overall coverage

### 2. 🔴 **Metadata Helpers** (0% coverage)

**File**: `src/helpers/metadata.ts`

**Why Important**: Critical for SEO functionality

**Test Coverage Needed**:
- Meta tag generation
- OpenGraph tags
- Twitter Card tags
- JSON-LD structured data
- Canonical URLs

**Estimated Impact**: +13% overall coverage

### 3. 🔴 **Preview Mode** (0% coverage)

**File**: `src/preview/index.ts`

**Why Important**: Essential for content preview workflow

**Test Coverage Needed**:
- Preview mode enablement
- Preview token validation
- Preview data fetching
- Preview mode exit

**Estimated Impact**: +10% overall coverage

### 4. 🔴 **Revalidation** (0% coverage)

**File**: `src/revalidation/index.ts`

**Why Important**: Cache invalidation is critical

**Test Coverage Needed**:
- Path revalidation
- Tag-based revalidation
- Webhook handling
- Error handling

**Estimated Impact**: +13% overall coverage

### 5. ⚠️ **SDK Index** (36.78% coverage)

**File**: `src/sdk/index.ts`

**Why Important**: Main SDK entry point with many functions

**Test Coverage Needed**:
- All factory functions (`createStrapiSDK`, etc.)
- Query execution paths
- Error handling
- Type conversions

**Estimated Impact**: +15% overall coverage

## Improving Coverage

### Step 1: Add Missing Test Files

Create test files for untested modules:

```bash
# Create test files
src/components/__tests__/StrapiImage.test.tsx
src/helpers/__tests__/metadata.test.ts
src/preview/__tests__/index.test.ts
src/revalidation/__tests__/index.test.ts
```

### Step 2: Increase SDK Coverage

Add more test cases to `src/sdk/__tests__/index.test.ts`:
- Test all exported functions
- Test error scenarios
- Test edge cases

### Step 3: Run Coverage After Each Addition

```bash
npm run test:coverage
```

Monitor the coverage increase after each test file addition.

### Step 4: Update Thresholds

Once coverage improves, update thresholds in `vitest.config.ts`:

```typescript
thresholds: {
  lines: 50,        // Increase by 5-10% increments
  functions: 55,
  branches: 80,
  statements: 50,
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Tests with Coverage
  run: npm run test:coverage

- name: Upload Coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: unittests
    fail_ci_if_error: true
```

### Coverage Badges

Add coverage badges to README.md:

```markdown
[![Coverage Status](https://codecov.io/gh/DDevFurkanPasa/NextGen/branch/main/graph/badge.svg)](https://codecov.io/gh/DDevFurkanPasa/NextGen)
```

## Best Practices

### 1. Test What Matters

Focus on:
- Public API functions
- Critical business logic
- Error handling paths
- Edge cases

### 2. Don't Chase 100%

Some code doesn't need tests:
- Type definitions
- Simple exports
- Configuration files

### 3. Quality Over Quantity

- One well-designed test > multiple redundant tests
- Focus on meaningful assertions
- Test behavior, not implementation

### 4. Keep Tests Fast

- Use mocks for external dependencies
- Avoid real network calls
- Keep unit tests under 100ms

### 5. Update Coverage Regularly

- Review coverage reports weekly
- Add tests for new features
- Refactor to improve testability

## Coverage Reports in CI

### Fail Build on Coverage Decrease

Thresholds will fail the build if coverage drops below baseline:

```bash
ERROR: Coverage for statements (35%) does not meet global threshold (35%)
```

This prevents accidental coverage regression.

### Coverage Trends

Track coverage over time:
- Baseline: 37.68% (v0.1.0)
- Target v0.2.0: 50%
- Target v0.5.0: 65%
- Target v1.0.0: 80%

## Troubleshooting

### Coverage Report Not Generating

```bash
# Clean coverage directory
rm -rf coverage
npm run test:coverage
```

### Vitest Can't Find Test Files

Check `vitest.config.ts` include patterns:

```typescript
include: ['src/**/__tests__/**/*.test.{ts,tsx}']
```

### Coverage Too Low

1. Check which files have 0% coverage
2. Focus on high-impact modules first
3. Add tests incrementally
4. Update thresholds gradually

## Additional Resources

- [Vitest Coverage Documentation](https://vitest.dev/guide/coverage.html)
- [V8 Coverage Provider](https://vitest.dev/guide/coverage.html#coverage-providers)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

*Last Updated: 2025-11-04*
*Coverage Baseline: v0.1.0 - 37.68%*
