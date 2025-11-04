/**
 * Parse Lighthouse benchmark results
 */

const fs = require('fs');
const path = require('path');

const LIGHTHOUSE_DIR = path.join(process.cwd(), '.lighthouse-benchmark');
const OUTPUT_DIR = path.join(process.cwd(), 'benchmark-results');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

try {
  // Find manifest file
  const manifestPath = path.join(LIGHTHOUSE_DIR, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('⚠️  No Lighthouse manifest found. Skipping parse.');
    process.exit(0);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  if (!manifest || manifest.length === 0) {
    console.log('⚠️  Empty Lighthouse manifest. Skipping parse.');
    process.exit(0);
  }

  // Parse results from all URLs
  const results = manifest.map(entry => {
    const jsonPath = entry.jsonPath;
    const fullPath = path.join(LIGHTHOUSE_DIR, jsonPath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Result file not found: ${fullPath}`);
      return null;
    }
    
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    return {
      url: data.requestedUrl,
      scores: {
        performance: Math.round(data.categories.performance.score * 100),
        accessibility: Math.round(data.categories.accessibility.score * 100),
        bestPractices: Math.round(data.categories['best-practices'].score * 100),
        seo: Math.round(data.categories.seo.score * 100),
      },
      metrics: {
        fcp: data.audits['first-contentful-paint'].numericValue,
        lcp: data.audits['largest-contentful-paint'].numericValue,
        cls: data.audits['cumulative-layout-shift'].numericValue,
        tbt: data.audits['total-blocking-time'].numericValue,
        speedIndex: data.audits['speed-index'].numericValue,
        tti: data.audits.interactive.numericValue,
      },
      timing: data.timing.total,
    };
  }).filter(Boolean);

  // Calculate averages
  const averages = {
    scores: {
      performance: Math.round(results.reduce((sum, r) => sum + r.scores.performance, 0) / results.length),
      accessibility: Math.round(results.reduce((sum, r) => sum + r.scores.accessibility, 0) / results.length),
      bestPractices: Math.round(results.reduce((sum, r) => sum + r.scores.bestPractices, 0) / results.length),
      seo: Math.round(results.reduce((sum, r) => sum + r.scores.seo, 0) / results.length),
    },
    metrics: {
      fcp: Math.round(results.reduce((sum, r) => sum + r.metrics.fcp, 0) / results.length),
      lcp: Math.round(results.reduce((sum, r) => sum + r.metrics.lcp, 0) / results.length),
      cls: parseFloat((results.reduce((sum, r) => sum + r.metrics.cls, 0) / results.length).toFixed(3)),
      tbt: Math.round(results.reduce((sum, r) => sum + r.metrics.tbt, 0) / results.length),
      speedIndex: Math.round(results.reduce((sum, r) => sum + r.metrics.speedIndex, 0) / results.length),
      tti: Math.round(results.reduce((sum, r) => sum + r.metrics.tti, 0) / results.length),
    },
  };

  // Save detailed results
  const output = {
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local',
    branch: process.env.GITHUB_REF_NAME || 'local',
    results,
    averages,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'lighthouse-results.json'),
    JSON.stringify(output, null, 2)
  );

  // Console output
  console.log('\n📊 Lighthouse Benchmark Results\n');
  console.log('Average Scores:');
  console.log(`  Performance:    ${averages.scores.performance}/100`);
  console.log(`  Accessibility:  ${averages.scores.accessibility}/100`);
  console.log(`  Best Practices: ${averages.scores.bestPractices}/100`);
  console.log(`  SEO:            ${averages.scores.seo}/100`);
  console.log('\nAverage Metrics:');
  console.log(`  FCP:         ${averages.metrics.fcp}ms`);
  console.log(`  LCP:         ${averages.metrics.lcp}ms`);
  console.log(`  CLS:         ${averages.metrics.cls}`);
  console.log(`  TBT:         ${averages.metrics.tbt}ms`);
  console.log(`  Speed Index: ${averages.metrics.speedIndex}ms`);
  console.log(`  TTI:         ${averages.metrics.tti}ms`);

  // Check for regressions
  const hasRegression = 
    averages.scores.performance < 95 ||
    averages.metrics.fcp > 1800 ||
    averages.metrics.lcp > 2500 ||
    averages.metrics.cls > 0.1 ||
    averages.metrics.tbt > 200;

  if (hasRegression) {
    console.log('\n⚠️  Performance regression detected!');
  } else {
    console.log('\n✅ All performance metrics within acceptable ranges.');
  }

  console.log(`\n📁 Results saved to: ${OUTPUT_DIR}/lighthouse-results.json\n`);

} catch (error) {
  console.error('❌ Error parsing Lighthouse results:', error.message);
  process.exit(1);
}
