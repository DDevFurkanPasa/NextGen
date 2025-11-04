# CI/CD Integration Guide

This document explains the automated quality gates configured for the NextGen Framework.

## 🎯 Overview

The CI/CD pipeline enforces two critical quality gates on all pull requests:

1. **Lighthouse CI**: Ensures performance, accessibility, SEO, and best practices remain at 95+
2. **Coverage Check**: Prevents code coverage regression below baseline (96.59% statements)

## 🚦 Lighthouse CI

### Configuration

- **File**: `lighthouserc.json`
- **Workflow**: `.github/workflows/lighthouse-ci.yml`
- **Enforced Thresholds**:
  - Performance: ≥95/100
  - Accessibility: ≥95/100
  - Best Practices: ≥95/100
  - SEO: ≥95/100

### What It Does

1. Builds the application in production mode
2. Runs Lighthouse tests on configured URLs
3. Posts results as PR comment with scores
4. **FAILS the PR** if any score drops below 95

### Test URLs

By default, tests these pages:
- Homepage: `http://localhost:3000/`
- About: `http://localhost:3000/about`
- Blog: `http://localhost:3000/blog`

**To customize**: Edit `lighthouserc.json` → `ci.collect.url`

### Local Testing

```bash
# Install Lighthouse CI globally
npm install -g @lhci/cli

# Build your app
npm run build

# Start your server
npm run start

# In another terminal, run Lighthouse CI
lhci autorun
```

### Lighthouse CI Metrics

**Core Web Vitals Tracked**:
- **FCP** (First Contentful Paint): ≤1.8s
- **LCP** (Largest Contentful Paint): ≤2.5s
- **CLS** (Cumulative Layout Shift): ≤0.1
- **TBT** (Total Blocking Time): ≤200ms
- **Speed Index**: ≤3.4s

## 📊 Coverage Check

### Configuration

- **File**: `vitest.config.ts` (thresholds)
- **Workflow**: `.github/workflows/coverage-check.yml`
- **Enforced Baseline**:
  - Statements: ≥96%
  - Branches: ≥94%
  - Functions: ≥95%
  - Lines: ≥96%

### What It Does

1. Runs entire test suite with coverage
2. Generates coverage reports (HTML, JSON, LCOV)
3. Uploads reports to Codecov (optional)
4. Posts results as PR comment
5. **FAILS the build** if coverage drops below thresholds

### Why These Thresholds?

These thresholds match the **current coverage baseline** achieved in Phase 6:
- ✅ 96.59% statements
- ✅ 94.52% branches
- ✅ 96% functions
- ✅ 96.59% lines

**Goal**: Prevent regression. Any PR that reduces coverage will be **automatically blocked**.

### Local Testing

```bash
# Run tests with coverage
npm run test:coverage

# Open HTML report
npm run test:coverage:report

# Watch mode with coverage
npm run test:coverage:watch
```

### Coverage Reports

After running `npm run test:coverage`, reports are generated in `./coverage/`:

- **HTML**: `coverage/index.html` (visual report)
- **JSON**: `coverage/coverage-summary.json` (CI/CD integration)
- **LCOV**: `coverage/lcov.info` (Codecov, IDE integration)
- **Text**: Console output (quick summary)

## 🔒 Branch Protection Rules

To enforce these checks on GitHub:

### 1. Navigate to Repository Settings
- Go to **Settings** → **Branches** → **Branch protection rules**
- Click **Add rule** or edit existing rule for `main`

### 2. Configure Protection Rule

**Branch name pattern**: `main` (or `develop`)

**Protect matching branches** - Enable:
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - **Required status checks**:
    - `lighthouse` (from lighthouse-ci.yml)
    - `coverage` (from coverage-check.yml)
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

### 3. Save Protection Rule

Now all PRs to `main` will be **blocked** if:
- Any Lighthouse score drops below 95
- Any coverage metric drops below baseline

## 🎨 PR Comments

Both workflows post automated comments on PRs:

### Lighthouse CI Comment Example

```
## 🚦 Lighthouse CI Results

| Category | Score |
|----------|-------|
| 🟢 Performance | **98**/100 |
| 🟢 Accessibility | **100**/100 |
| 🟢 Best Practices | **100**/100 |
| 🟢 SEO | **100**/100 |

✅ All scores meet the 95+ threshold!

[View detailed report](https://...)
```

### Coverage Check Comment Example

```
## 📊 Code Coverage Report

| Category | Coverage |
|----------|----------|
| Statements | 🟢 **96.59%** (1020/1056) |
| Branches | 🟢 **94.52%** (190/201) |
| Functions | 🟢 **96%** (24/25) |
| Lines | 🟢 **96.59%** (1020/1056) |

### Thresholds (Enforced)
- ✅ Statements: ≥96%
- ✅ Branches: ≥94%
- ✅ Functions: ≥95%
- ✅ Lines: ≥96%

✅ All coverage thresholds met! No regression detected.
```

## 🔧 Troubleshooting

### Lighthouse CI Fails

**Issue**: "startServerCommand failed to listen"
- **Solution**: Ensure `npm run start` works locally and listens on port 3000
- **Alternative**: Use `startServerCommand: "npm run dev"` for development server

**Issue**: "Navigation timeout"
- **Solution**: Check `startServerReadyPattern` in `lighthouserc.json` matches your server output

### Coverage Check Fails

**Issue**: "Coverage for statements (95.5%) does not meet global threshold (96%)"
- **Solution**: Add tests to cover the missing code. Run `npm run test:coverage:report` to see what's uncovered.
- **Prevention**: Always run `npm run test:coverage` before committing.

**Issue**: "No coverage summary found"
- **Solution**: Ensure `vitest.config.ts` has `reporter: ['json', ...]` enabled.

## 📦 Required Secrets (Optional)

For enhanced features, configure these GitHub secrets:

### `CODECOV_TOKEN` (Optional)
- **Purpose**: Upload coverage to Codecov for trend tracking
- **Get token**: Sign up at [codecov.io](https://codecov.io), add repository
- **Set in**: GitHub Settings → Secrets → Actions → New repository secret

### `LHCI_GITHUB_APP_TOKEN` (Optional)
- **Purpose**: Enhanced Lighthouse CI reports with GitHub App integration
- **Get token**: Install [Lighthouse CI GitHub App](https://github.com/apps/lighthouse-ci)
- **Set in**: GitHub Settings → Secrets → Actions → New repository secret

## 🚀 Workflow Triggers

Both workflows trigger on:
- **Pull Requests** to `main` or `develop` branches
- **Direct pushes** to `main` (for baseline verification)

To change triggers, edit the `on:` section in workflow files.

## 📈 Monitoring

### Coverage Trends
- View coverage reports in Actions → Coverage Check → Artifacts
- Track trends via Codecov dashboard (if configured)

### Lighthouse Trends
- View detailed reports in Actions → Lighthouse CI → Artifacts
- Compare scores across PRs using uploaded results

## 🎯 Best Practices

### For Developers

1. **Before opening a PR**:
   ```bash
   npm run test:coverage
   npm run test:e2e
   ```

2. **If coverage drops**:
   - Open `coverage/index.html` to see uncovered lines
   - Add tests for new code
   - Don't lower thresholds unless discussed with team

3. **If Lighthouse fails**:
   - Run `lhci autorun` locally to debug
   - Check bundle size, image optimization, lazy loading
   - Review Core Web Vitals impact

### For Maintainers

1. **Review threshold updates carefully**: Lowering thresholds = accepting technical debt
2. **Monitor trends**: Use Codecov/Lighthouse CI dashboards
3. **Update thresholds up**: When coverage improves beyond baseline, raise thresholds

## 🏆 Current Status

- **Coverage Baseline**: 96.59% statements (near-perfect)
- **Lighthouse Baseline**: 100/100 across all categories
- **Total Tests**: 220 passing (12 test files)
- **Framework Status**: v1.0.0 production-ready ✅

---

**Note**: These CI/CD gates ensure the framework maintains its quality standards as it evolves. They're designed to catch regressions early and maintain the near-perfect coverage achieved in Phase 6.
