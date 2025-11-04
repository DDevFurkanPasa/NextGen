/**
 * Generate comprehensive performance report
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(process.cwd(), 'benchmark-results');
const REPORT_PATH = path.join(process.cwd(), 'performance-report.json');

try {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load Lighthouse results
  const lighthousePath = path.join(OUTPUT_DIR, 'lighthouse-results.json');
  let lighthouseData = null;
  
  if (fs.existsSync(lighthousePath)) {
    lighthouseData = JSON.parse(fs.readFileSync(lighthousePath, 'utf8'));
  }

  // Load bundle size results
  const bundlePath = path.join(OUTPUT_DIR, 'bundle-size.json');
  let bundleData = null;
  
  if (fs.existsSync(bundlePath)) {
    bundleData = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  }

  // Load memory benchmark results (if available)
  const memoryPath = path.join(OUTPUT_DIR, 'memory-benchmark.json');
  let memoryData = null;
  
  if (fs.existsSync(memoryPath)) {
    memoryData = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
  }

  // Determine if there are any regressions
  let hasRegression = false;
  const issues = [];

  if (lighthouseData) {
    const { averages } = lighthouseData;
    
    if (averages.scores.performance < 95) {
      hasRegression = true;
      issues.push(`Performance score below 95: ${averages.scores.performance}`);
    }
    
    if (averages.metrics.fcp > 1800) {
      hasRegression = true;
      issues.push(`FCP above 1.8s: ${averages.metrics.fcp}ms`);
    }
    
    if (averages.metrics.lcp > 2500) {
      hasRegression = true;
      issues.push(`LCP above 2.5s: ${averages.metrics.lcp}ms`);
    }
    
    if (averages.metrics.cls > 0.1) {
      hasRegression = true;
      issues.push(`CLS above 0.1: ${averages.metrics.cls}`);
    }
    
    if (averages.metrics.tbt > 200) {
      hasRegression = true;
      issues.push(`TBT above 200ms: ${averages.metrics.tbt}ms`);
    }
  }

  if (bundleData && !bundleData.bundles.total.withinBudget) {
    hasRegression = true;
    const overBudget = bundleData.bundles.total.gzip - bundleData.bundles.total.budget;
    issues.push(`Bundle size over budget by ${(overBudget / 1024).toFixed(2)} KB`);
  }

  // Generate comprehensive report
  const report = {
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local',
    branch: process.env.GITHUB_REF_NAME || 'local',
    hasRegression,
    issues,
    
    // Lighthouse metrics
    fcp: lighthouseData?.averages.metrics.fcp || 0,
    lcp: lighthouseData?.averages.metrics.lcp || 0,
    cls: lighthouseData?.averages.metrics.cls || 0,
    tbt: lighthouseData?.averages.metrics.tbt || 0,
    speedIndex: lighthouseData?.averages.metrics.speedIndex || 0,
    tti: lighthouseData?.averages.metrics.tti || 0,
    
    scores: {
      performance: lighthouseData?.averages.scores.performance || 0,
      accessibility: lighthouseData?.averages.scores.accessibility || 0,
      bestPractices: lighthouseData?.averages.scores.bestPractices || 0,
      seo: lighthouseData?.averages.scores.seo || 0,
    },
    
    bundles: bundleData?.bundles || {
      main: { raw: 0, gzip: 0 },
      css: { raw: 0, gzip: 0 },
      total: { raw: 0, gzip: 0 },
    },
    
    memory: memoryData || null,
    
    // Format for benchmark-action/github-action-benchmark
    metrics: {
      'Performance Score': lighthouseData?.averages.scores.performance || 0,
      'FCP (ms)': lighthouseData?.averages.metrics.fcp || 0,
      'LCP (ms)': lighthouseData?.averages.metrics.lcp || 0,
      'CLS': (lighthouseData?.averages.metrics.cls || 0) * 1000, // Scale for visibility
      'TBT (ms)': lighthouseData?.averages.metrics.tbt || 0,
      'Speed Index': lighthouseData?.averages.metrics.speedIndex || 0,
      'Bundle Size (KB)': bundleData ? bundleData.bundles.total.gzip / 1024 : 0,
    },
  };

  // Save report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // Save metrics in benchmark format
  const benchmarkMetrics = Object.entries(report.metrics).map(([name, value]) => ({
    name,
    unit: name.includes('Score') ? 'score' : name.includes('KB') ? 'KB' : 'ms',
    value: Math.round(value * 100) / 100,
  }));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'performance-metrics.json'),
    JSON.stringify(benchmarkMetrics, null, 2)
  );

  // Console output
  console.log('\n📊 Performance Report Generated\n');
  
  if (lighthouseData) {
    console.log('Lighthouse Scores:');
    console.log(`  Performance:    ${report.scores.performance}/100`);
    console.log(`  Accessibility:  ${report.scores.accessibility}/100`);
    console.log(`  Best Practices: ${report.scores.bestPractices}/100`);
    console.log(`  SEO:            ${report.scores.seo}/100`);
  }
  
  if (bundleData) {
    console.log('\nBundle Sizes:');
    console.log(`  Main JS: ${(report.bundles.main.gzip / 1024).toFixed(2)} KB (gzipped)`);
    console.log(`  CSS:     ${(report.bundles.css.gzip / 1024).toFixed(2)} KB (gzipped)`);
    console.log(`  Total:   ${(report.bundles.total.gzip / 1024).toFixed(2)} KB (gzipped)`);
  }

  if (hasRegression) {
    console.log('\n⚠️  Performance Issues Found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('\n✅ No performance regressions detected.');
  }

  console.log(`\n📁 Report saved to: ${REPORT_PATH}\n`);

} catch (error) {
  console.error('❌ Error generating performance report:', error.message);
  process.exit(1);
}
