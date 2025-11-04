/**
 * Check performance budgets and fail if exceeded
 */

const fs = require('fs');
const path = require('path');

const REPORT_PATH = path.join(process.cwd(), 'performance-report.json');
const FAIL_ON_EXCEED = process.env.FAIL_ON_BUDGET_EXCEED !== 'false';

// Performance budgets
const BUDGETS = {
  fcp: 1800,           // First Contentful Paint ≤ 1.8s
  lcp: 2500,           // Largest Contentful Paint ≤ 2.5s
  cls: 0.1,            // Cumulative Layout Shift ≤ 0.1
  tbt: 200,            // Total Blocking Time ≤ 200ms
  speedIndex: 3400,    // Speed Index ≤ 3.4s
  tti: 3800,           // Time to Interactive ≤ 3.8s
  performanceScore: 95, // Lighthouse Performance Score ≥ 95
  bundleSize: 250,     // Total bundle size (gzipped) ≤ 250 KB
};

try {
  if (!fs.existsSync(REPORT_PATH)) {
    console.log('⚠️  No performance report found. Run benchmarks first.');
    console.log('\nTo generate performance data:');
    console.log('  1. Install Lighthouse CI: npm install -g @lhci/cli');
    console.log('  2. Build your app: npm run build');
    console.log('  3. Run benchmarks: npm run benchmark');
    console.log('\nSkipping budget check (no data available).\n');
    process.exit(0);
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  
  // Check if report has actual data (not all zeros)
  const hasData = report.fcp > 0 || report.lcp > 0 || report.scores.performance > 0;
  
  if (!hasData) {
    console.log('⚠️  No performance data in report (all metrics are 0).');
    console.log('\nThis usually means Lighthouse benchmarks haven\'t been run yet.');
    console.log('\nTo generate performance data:');
    console.log('  1. Install Lighthouse CI: npm install -g @lhci/cli');
    console.log('  2. Build your app: npm run build');
    console.log('  3. Start your server: npm run start');
    console.log('  4. In another terminal, run: npm run benchmark:lighthouse');
    console.log('  5. Then run: npm run benchmark:parse && npm run benchmark:report');
    console.log('\nSkipping budget check (no valid data).\n');
    process.exit(0);
  }
  
  const checks = [
    {
      name: 'First Contentful Paint',
      value: report.fcp,
      budget: BUDGETS.fcp,
      unit: 'ms',
      passed: report.fcp <= BUDGETS.fcp,
    },
    {
      name: 'Largest Contentful Paint',
      value: report.lcp,
      budget: BUDGETS.lcp,
      unit: 'ms',
      passed: report.lcp <= BUDGETS.lcp,
    },
    {
      name: 'Cumulative Layout Shift',
      value: report.cls,
      budget: BUDGETS.cls,
      unit: '',
      passed: report.cls <= BUDGETS.cls,
    },
    {
      name: 'Total Blocking Time',
      value: report.tbt,
      budget: BUDGETS.tbt,
      unit: 'ms',
      passed: report.tbt <= BUDGETS.tbt,
    },
    {
      name: 'Speed Index',
      value: report.speedIndex,
      budget: BUDGETS.speedIndex,
      unit: 'ms',
      passed: report.speedIndex <= BUDGETS.speedIndex,
    },
    {
      name: 'Time to Interactive',
      value: report.tti,
      budget: BUDGETS.tti,
      unit: 'ms',
      passed: report.tti <= BUDGETS.tti,
    },
    {
      name: 'Performance Score',
      value: report.scores.performance,
      budget: BUDGETS.performanceScore,
      unit: '/100',
      passed: report.scores.performance >= BUDGETS.performanceScore,
    },
    {
      name: 'Bundle Size (gzipped)',
      value: Math.round(report.bundles.total.gzip / 1024),
      budget: BUDGETS.bundleSize,
      unit: 'KB',
      passed: report.bundles.total.gzip <= BUDGETS.bundleSize * 1024,
    },
  ];

  const failures = checks.filter(c => !c.passed);
  
  console.log('\n💰 Performance Budget Check\n');
  console.log('Budget Status:');
  
  checks.forEach(check => {
    const status = check.passed ? '✅' : '❌';
    const valueStr = `${check.value}${check.unit}`;
    const budgetStr = `${check.budget}${check.unit}`;
    console.log(`  ${status} ${check.name.padEnd(30)} ${valueStr.padEnd(12)} (budget: ${budgetStr})`);
  });

  if (failures.length > 0) {
    console.log(`\n❌ ${failures.length} budget(s) exceeded:`);
    failures.forEach(f => {
      const over = f.name === 'Performance Score' 
        ? f.budget - f.value 
        : f.value - f.budget;
      console.log(`  - ${f.name}: ${over}${f.unit} over budget`);
    });
    
    if (FAIL_ON_EXCEED) {
      console.log('\n⚠️  Failing due to budget exceedance (FAIL_ON_BUDGET_EXCEED=true)\n');
      process.exit(1);
    } else {
      console.log('\n⚠️  Budget exceeded but not failing (FAIL_ON_BUDGET_EXCEED=false)\n');
    }
  } else {
    console.log('\n✅ All performance budgets met!\n');
  }

} catch (error) {
  console.error('❌ Error checking performance budget:', error.message);
  process.exit(1);
}
