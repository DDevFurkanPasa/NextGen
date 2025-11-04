/**
 * Analyze and check bundle sizes
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DIST_DIR = path.join(process.cwd(), 'dist');
const OUTPUT_DIR = path.join(process.cwd(), 'benchmark-results');

// Bundle size budgets (in bytes)
const BUDGETS = {
  main: 150 * 1024,      // 150 KB
  css: 50 * 1024,        // 50 KB
  total: 250 * 1024,     // 250 KB
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function getGzipSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(content, { level: 9 });
    return gzipped.length;
  } catch {
    return 0;
  }
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

try {
  if (!fs.existsSync(DIST_DIR)) {
    console.log('⚠️  Dist directory not found. Run `npm run build` first.');
    process.exit(0);
  }

  // Find all .js and .css files
  const files = fs.readdirSync(DIST_DIR);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  // Calculate main JS bundle size
  let mainJsSize = 0;
  let mainJsGzip = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(DIST_DIR, file);
    mainJsSize += getFileSize(filePath);
    mainJsGzip += getGzipSize(filePath);
  });

  // Calculate CSS bundle size
  let cssSize = 0;
  let cssGzip = 0;
  
  cssFiles.forEach(file => {
    const filePath = path.join(DIST_DIR, file);
    cssSize += getFileSize(filePath);
    cssGzip += getGzipSize(filePath);
  });

  const totalSize = mainJsSize + cssSize;
  const totalGzip = mainJsGzip + cssGzip;

  const results = {
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local',
    bundles: {
      main: {
        raw: mainJsSize,
        gzip: mainJsGzip,
        budget: BUDGETS.main,
        withinBudget: mainJsGzip <= BUDGETS.main,
      },
      css: {
        raw: cssSize,
        gzip: cssGzip,
        budget: BUDGETS.css,
        withinBudget: cssGzip <= BUDGETS.css,
      },
      total: {
        raw: totalSize,
        gzip: totalGzip,
        budget: BUDGETS.total,
        withinBudget: totalGzip <= BUDGETS.total,
      },
    },
    files: {
      js: jsFiles.map(f => ({
        name: f,
        size: getFileSize(path.join(DIST_DIR, f)),
        gzip: getGzipSize(path.join(DIST_DIR, f)),
      })),
      css: cssFiles.map(f => ({
        name: f,
        size: getFileSize(path.join(DIST_DIR, f)),
        gzip: getGzipSize(path.join(DIST_DIR, f)),
      })),
    },
  };

  // Save results
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'bundle-size.json'),
    JSON.stringify(results, null, 2)
  );

  // Console output
  console.log('\n📦 Bundle Size Analysis\n');
  console.log('Main JS Bundle:');
  console.log(`  Raw:    ${formatSize(mainJsSize)}`);
  console.log(`  Gzipped: ${formatSize(mainJsGzip)} ${mainJsGzip <= BUDGETS.main ? '✅' : '⚠️  (exceeds budget)'}`);
  console.log(`  Budget:  ${formatSize(BUDGETS.main)}`);
  
  console.log('\nCSS Bundle:');
  console.log(`  Raw:    ${formatSize(cssSize)}`);
  console.log(`  Gzipped: ${formatSize(cssGzip)} ${cssGzip <= BUDGETS.css ? '✅' : '⚠️  (exceeds budget)'}`);
  console.log(`  Budget:  ${formatSize(BUDGETS.css)}`);
  
  console.log('\nTotal:');
  console.log(`  Raw:    ${formatSize(totalSize)}`);
  console.log(`  Gzipped: ${formatSize(totalGzip)} ${totalGzip <= BUDGETS.total ? '✅' : '⚠️  (exceeds budget)'}`);
  console.log(`  Budget:  ${formatSize(BUDGETS.total)}`);

  if (!results.bundles.total.withinBudget) {
    console.log('\n⚠️  Bundle size exceeds budget!');
  } else {
    console.log('\n✅ All bundles within budget.');
  }

  console.log(`\n📁 Results saved to: ${OUTPUT_DIR}/bundle-size.json\n`);

} catch (error) {
  console.error('❌ Error analyzing bundle size:', error.message);
  process.exit(1);
}
