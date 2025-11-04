# Performance Benchmarking & Continuous Monitoring

This document explains the performance benchmarking system configured for the NextGen Framework.

> **🚀 New to benchmarking?** See [BENCHMARKING_QUICKSTART.md](./BENCHMARKING_QUICKSTART.md) for a quick setup guide!

## 🎯 Overview

The framework includes comprehensive performance monitoring that tracks:

1. **Lighthouse Metrics**: Core Web Vitals, Performance scores
2. **Bundle Sizes**: JavaScript and CSS bundle sizes (raw & gzipped)
3. **Memory Usage**: Heap usage and memory allocation patterns
4. **Performance Budgets**: Automated checks against defined thresholds

## 🚀 Quick Start

### Run All Benchmarks

```bash
# Build first
npm run build

# Run all benchmarks
npm run benchmark
```

### Run Individual Benchmarks

```bash
# Lighthouse performance metrics
npm run benchmark:lighthouse

# Bundle size analysis
npm run benchmark:bundle

# Memory usage analysis
npm run benchmark:memory
```

### Generate Reports

```bash
# Parse Lighthouse results
npm run benchmark:parse

# Generate comprehensive report
npm run benchmark:report

# Check against performance budgets
npm run benchmark:check
```

## 📊 Performance Metrics

### Core Web Vitals

| Metric | Budget | Description |
|--------|--------|-------------|
| **FCP** | ≤1.8s | First Contentful Paint |
| **LCP** | ≤2.5s | Largest Contentful Paint |
| **CLS** | ≤0.1 | Cumulative Layout Shift |
| **TBT** | ≤200ms | Total Blocking Time |
| **Speed Index** | ≤3.4s | Visual completeness |
| **TTI** | ≤3.8s | Time to Interactive |

### Lighthouse Scores

| Category | Budget |
|----------|--------|
| Performance | ≥95/100 |
| Accessibility | ≥95/100 |
| Best Practices | ≥95/100 |
| SEO | ≥95/100 |

### Bundle Size Budgets

| Bundle | Budget (gzipped) |
|--------|-----------------|
| Main JS | 150 KB |
| CSS | 50 KB |
| Total | 250 KB |

## 🤖 Automated Monitoring

### GitHub Actions Workflow

**File**: `.github/workflows/performance-benchmark.yml`

**Triggers**:
- ✅ Every push to `main`
- ✅ Every pull request to `main`/`develop`
- ✅ Daily at 2 AM UTC (scheduled)
- ✅ Manual workflow dispatch

**What It Does**:
1. Runs Lighthouse benchmarks (5 runs per URL for accuracy)
2. Analyzes bundle sizes
3. Runs memory benchmarks
4. Generates comprehensive performance report
5. Posts results as PR comment
6. Stores data for trend analysis (90-day retention)
7. Checks performance budgets

### Benchmark History

All benchmark results are stored in GitHub Actions artifacts for 90 days, allowing you to:
- Track performance trends over time
- Compare performance across commits
- Identify performance regressions
- Analyze long-term patterns

## 📈 Trend Analysis

### Using github-action-benchmark

The workflow integrates with `benchmark-action/github-action-benchmark` to:
- Store historical performance data
- Generate interactive charts
- Alert on performance regressions (>150% threshold)
- Automatically comment on PRs with regression warnings

### View Benchmark History

1. Go to **Actions** → **Performance Benchmark**
2. Select any workflow run
3. Download **performance-benchmarks** artifact
4. View JSON reports for detailed metrics

## 📝 Output Files

All benchmark results are saved to `benchmark-results/`:

### `lighthouse-results.json`
```json
{
  "timestamp": "2025-11-04T...",
  "commit": "abc123",
  "results": [...],
  "averages": {
    "scores": {...},
    "metrics": {...}
  }
}
```

### `bundle-size.json`
```json
{
  "bundles": {
    "main": { "raw": 123456, "gzip": 45678 },
    "css": { "raw": 12345, "gzip": 4567 },
    "total": { "raw": 135801, "gzip": 50245 }
  },
  "files": {...}
}
```

### `memory-benchmark.json`
```json
{
  "initial": {...},
  "final": {...},
  "delta": {...}
}
```

### `performance-report.json`
Comprehensive report combining all metrics, used for PR comments and budget checks.

### `performance-metrics.json`
Formatted for `github-action-benchmark` integration.

## 🔧 Configuration

### Lighthouse Configuration

**File**: `lighthouserc.benchmark.json`

- **Runs**: 5 runs per URL (averages for consistency)
- **Preset**: Desktop (1920x1080)
- **Throttling**: Minimal (simulates fast connection)
- **URLs**: Home, About, Blog

To add more URLs:
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/your-new-page"
      ]
    }
  }
}
```

### Performance Budgets

**File**: `scripts/check-performance-budget.js`

To adjust budgets, edit the `BUDGETS` object:
```javascript
const BUDGETS = {
  fcp: 1800,           // FCP ≤ 1.8s
  lcp: 2500,           // LCP ≤ 2.5s
  cls: 0.1,            // CLS ≤ 0.1
  tbt: 200,            // TBT ≤ 200ms
  speedIndex: 3400,    // Speed Index ≤ 3.4s
  tti: 3800,           // TTI ≤ 3.8s
  performanceScore: 95, // Lighthouse ≥ 95
  bundleSize: 250,     // Total ≤ 250 KB
};
```

### Bundle Size Budgets

**File**: `scripts/bundle-size-check.js`

To adjust bundle budgets:
```javascript
const BUDGETS = {
  main: 150 * 1024,   // Main JS ≤ 150 KB
  css: 50 * 1024,     // CSS ≤ 50 KB
  total: 250 * 1024,  // Total ≤ 250 KB
};
```

## 💡 Local Development

### Run Benchmarks Locally

```bash
# 1. Build your app
npm run build

# 2. Start your server (in another terminal)
npm run start

# 3. Run benchmarks
npm run benchmark

# 4. Generate report
npm run benchmark:parse
npm run benchmark:report

# 5. Check budgets
npm run benchmark:check
```

### Quick Bundle Analysis

```bash
npm run analyze:bundle
```

### Memory Profiling

```bash
npm run benchmark:memory
```

## 🎨 PR Comments

The workflow automatically posts performance results on PRs:

### Example Comment

```markdown
## 📊 Performance Benchmark Results

### Core Web Vitals
| Metric | Current | Threshold | Status |
|--------|---------|-----------|--------|
| **FCP** | 🟢 1245ms | ≤1.8s | ✅ |
| **LCP** | 🟢 1876ms | ≤2.5s | ✅ |
| **CLS** | 🟢 0.05 | ≤0.1 | ✅ |
| **TBT** | 🟢 156ms | ≤200ms | ✅ |
| **Speed Index** | 🟢 2134ms | ≤3.4s | ✅ |

### Bundle Size
| Bundle | Size | Gzipped |
|--------|------|---------|
| **Main JS** | 248.45 KB | 87.32 KB |
| **CSS** | 42.18 KB | 12.45 KB |
| **Total** | 290.63 KB | 99.77 KB |

### Performance Scores
- 🎯 **Performance**: 98/100
- ♿ **Accessibility**: 100/100
- ✨ **Best Practices**: 100/100
- 🔍 **SEO**: 100/100

✅ No performance regression detected.
```

## 📊 Interpreting Results

### Good Performance

- ✅ All Core Web Vitals within budgets
- ✅ Lighthouse Performance score ≥95
- ✅ Bundle size within budget
- ✅ No regression from baseline

### Performance Issues

- 🔴 **FCP > 1.8s**: Slow initial rendering
  - Check: Image optimization, code splitting
  
- 🔴 **LCP > 2.5s**: Largest element loads slowly
  - Check: Hero images, above-the-fold content
  
- 🔴 **CLS > 0.1**: Layout shifts
  - Check: Image dimensions, font loading
  
- 🔴 **TBT > 200ms**: Main thread blocked
  - Check: JavaScript execution, third-party scripts
  
- 🔴 **Bundle > 250 KB**: Large bundle size
  - Check: Unused code, tree-shaking, code splitting

## 🛠️ Optimization Tips

### Improve FCP/LCP
1. Optimize images (WebP, lazy loading)
2. Minimize CSS (critical CSS inline)
3. Enable compression (gzip/brotli)
4. Use CDN for static assets
5. Implement code splitting

### Improve CLS
1. Set explicit dimensions for images/videos
2. Avoid inserting content above existing content
3. Use font-display: swap
4. Reserve space for ads/embeds

### Reduce TBT
1. Minimize JavaScript execution time
2. Code split and lazy load
3. Defer non-critical JavaScript
4. Optimize third-party scripts
5. Use Web Workers for heavy computation

### Reduce Bundle Size
1. Tree-shake unused code
2. Minimize dependencies
3. Use dynamic imports
4. Enable minification
5. Analyze bundle with webpack-bundle-analyzer

## 🔍 Debugging Performance Issues

### Step 1: Identify the Issue

```bash
npm run benchmark
npm run benchmark:report
```

Review `performance-report.json` to identify which metrics failed.

### Step 2: Analyze Lighthouse Report

Open `.lighthouse-benchmark/*/lhr-*.html` in a browser to see detailed Lighthouse analysis with:
- Specific failing audits
- Opportunities for improvement
- Diagnostics

### Step 3: Analyze Bundle

```bash
npm run analyze:bundle
```

Review `benchmark-results/bundle-size.json` to see:
- Individual file sizes
- Which bundles are over budget
- Gzip compression ratios

### Step 4: Profile Memory

```bash
npm run benchmark:memory
```

Check heap usage patterns and identify memory leaks.

### Step 5: Fix and Verify

Make optimizations, then re-run benchmarks:

```bash
npm run build
npm run benchmark
npm run benchmark:check
```

## 🚦 Continuous Monitoring Benefits

✅ **Early Detection**: Catch performance regressions before production  
✅ **Historical Data**: Track performance trends over time  
✅ **Automated Alerts**: Get notified of significant regressions  
✅ **Team Visibility**: All team members see performance impacts  
✅ **Accountability**: Performance becomes part of code review  
✅ **Data-Driven**: Make optimization decisions based on real data  

## 📚 Related Documentation

- [CI/CD Integration](./CI_CD.md) - Quality gates and automation
- [TESTING.md](./TESTING.md) - Testing infrastructure
- [COVERAGE.md](./COVERAGE.md) - Code coverage details

## 🏆 Current Performance Status

- **Lighthouse Performance**: 100/100 ✅
- **Core Web Vitals**: All within budgets ✅
- **Bundle Size**: ~100 KB gzipped ✅
- **Monitoring**: Active with daily checks ✅

---

**Note**: Performance monitoring is automated and runs on every PR. The framework maintains near-perfect performance scores with automated regression prevention.
