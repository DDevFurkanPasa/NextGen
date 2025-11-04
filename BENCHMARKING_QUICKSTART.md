# Performance Benchmarking - Quick Start

## 🚀 First Time Setup

### Step 1: Install Lighthouse CI

```bash
npm install -g @lhci/cli
```

This installs the Lighthouse CI tool globally, which is required for running benchmarks.

### Step 2: Verify Installation

```bash
lhci --version
```

You should see a version number like `0.13.x`.

---

## 📊 Running Benchmarks Locally

### Full Benchmark Suite

```bash
# 1. Build your application
npm run build

# 2. Start the production server (in a separate terminal)
npm run start

# 3. Wait for server to be ready (you'll see "ready on http://localhost:3000")

# 4. In another terminal, run benchmarks
npm run benchmark:lighthouse  # Lighthouse metrics
npm run benchmark:bundle      # Bundle size
npm run benchmark:memory      # Memory usage

# 5. Parse results and generate report
npm run benchmark:parse
npm run benchmark:report

# 6. Check against budgets
npm run benchmark:check
```

### Quick Bundle Analysis (No server needed)

```bash
# Just analyze bundle size after building
npm run build
npm run analyze:bundle
```

---

## 🎯 What Each Command Does

| Command | What It Does | Requires Build | Requires Server |
|---------|--------------|----------------|-----------------|
| `npm run benchmark:lighthouse` | Runs Lighthouse on your app (5 runs) | ✅ | ✅ |
| `npm run benchmark:bundle` | Analyzes bundle sizes | ✅ | ❌ |
| `npm run benchmark:memory` | Measures memory usage | ❌ | ❌ |
| `npm run benchmark:parse` | Parses Lighthouse JSON results | ❌ | ❌ |
| `npm run benchmark:report` | Generates comprehensive report | ❌ | ❌ |
| `npm run benchmark:check` | Validates against budgets | ❌ | ❌ |
| `npm run analyze:bundle` | Quick bundle analysis | ✅ | ❌ |

---

## 📈 Viewing Results

### Console Output

All commands print results to the console:

```bash
npm run benchmark:check
```

Output:
```
💰 Performance Budget Check

Budget Status:
  ✅ First Contentful Paint         1245ms       (budget: 1800ms)
  ✅ Largest Contentful Paint       1876ms       (budget: 2500ms)
  ✅ Cumulative Layout Shift        0.05         (budget: 0.1)
  ...
```

### JSON Reports

Results are saved in `benchmark-results/`:

- `lighthouse-results.json` - Full Lighthouse data
- `bundle-size.json` - Bundle analysis
- `memory-benchmark.json` - Memory metrics
- `performance-report.json` - Combined report

### HTML Reports

Lighthouse generates HTML reports in `.lighthouse-benchmark/`:

```bash
# Open in browser
start .lighthouse-benchmark/*/lhr-*.html
```

---

## ⚠️ Troubleshooting

### Error: `'lhci' is not recognized`

**Problem**: Lighthouse CI not installed globally

**Solution**:
```bash
npm install -g @lhci/cli
```

### Error: `startServerCommand failed`

**Problem**: Server isn't starting or listening on port 3000

**Solution**:
1. Make sure you've built the app: `npm run build`
2. Manually start the server in another terminal: `npm run start`
3. Wait for "ready on http://localhost:3000"
4. Run `npm run benchmark:lighthouse` in the first terminal

### Error: `Navigation timeout`

**Problem**: Server is slow to respond or pages don't exist

**Solution**:
1. Check that all URLs in `lighthouserc.benchmark.json` exist
2. Increase timeout in config if needed
3. Make sure server is running in production mode

### Zero Metrics (0ms, 0/100)

**Problem**: Benchmarks haven't been run yet

**Solution**:
```bash
# Full sequence
npm run build
npm run start  # in another terminal
npm run benchmark:lighthouse
npm run benchmark:parse
npm run benchmark:report
npm run benchmark:check
```

---

## 🎯 Performance Budgets

Current budgets (edit in `scripts/check-performance-budget.js`):

| Metric | Budget |
|--------|--------|
| **FCP** | ≤1.8s |
| **LCP** | ≤2.5s |
| **CLS** | ≤0.1 |
| **TBT** | ≤200ms |
| **Speed Index** | ≤3.4s |
| **TTI** | ≤3.8s |
| **Performance Score** | ≥95/100 |
| **Bundle Size** | ≤250 KB (gzipped) |

---

## 🔄 Automated Monitoring (CI/CD)

Benchmarks run automatically in GitHub Actions:

- ✅ On every push to `main`
- ✅ On every PR to `main`/`develop`
- ✅ Daily at 2 AM UTC
- ✅ Manual workflow dispatch

**No local setup needed for CI/CD** - it runs automatically!

---

## 💡 Tips

### For Development

```bash
# Quick bundle check during development
npm run build
npm run analyze:bundle
```

### Before Committing

```bash
# Verify performance hasn't regressed
npm run build
npm run start  # separate terminal
npm run benchmark:lighthouse
npm run benchmark:check
```

### For CI/CD Testing

```bash
# Simulate what runs in GitHub Actions
npm run build
npm run benchmark
npm run benchmark:parse
npm run benchmark:report
npm run benchmark:check
```

---

## 📚 More Information

For detailed documentation, see:
- [PERFORMANCE_BENCHMARKING.md](./PERFORMANCE_BENCHMARKING.md) - Complete guide
- [CI_CD.md](./CI_CD.md) - CI/CD integration
- `.github/workflows/performance-benchmark.yml` - GitHub Actions workflow

---

## ✅ Quick Checklist

First time setup:
- [ ] Install Lighthouse CI: `npm install -g @lhci/cli`
- [ ] Verify installation: `lhci --version`

Before running benchmarks:
- [ ] Build the app: `npm run build`
- [ ] Start the server: `npm run start` (separate terminal)
- [ ] Wait for server ready message

Run benchmarks:
- [ ] `npm run benchmark:lighthouse`
- [ ] `npm run benchmark:parse`
- [ ] `npm run benchmark:report`
- [ ] `npm run benchmark:check`

Review results:
- [ ] Check console output
- [ ] Review `benchmark-results/*.json`
- [ ] Open HTML reports (optional)

---

**🎉 You're all set! The framework will maintain 100/100 Lighthouse scores with automated monitoring.**
