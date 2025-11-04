/**
 * Memory usage benchmark
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(process.cwd(), 'benchmark-results');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function formatMemory(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

try {
  // Get initial memory usage
  const initialMemory = process.memoryUsage();
  
  console.log('\n💾 Memory Benchmark\n');
  console.log('Initial Memory Usage:');
  console.log(`  Heap Used:  ${formatMemory(initialMemory.heapUsed)}`);
  console.log(`  Heap Total: ${formatMemory(initialMemory.heapTotal)}`);
  console.log(`  RSS:        ${formatMemory(initialMemory.rss)}`);
  console.log(`  External:   ${formatMemory(initialMemory.external)}`);

  // Simulate some operations (in a real scenario, this would run actual app code)
  const testData = [];
  for (let i = 0; i < 10000; i++) {
    testData.push({
      id: i,
      name: `Item ${i}`,
      data: new Array(100).fill(i),
    });
  }

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  // Get final memory usage
  const finalMemory = process.memoryUsage();
  
  console.log('\nFinal Memory Usage:');
  console.log(`  Heap Used:  ${formatMemory(finalMemory.heapUsed)}`);
  console.log(`  Heap Total: ${formatMemory(finalMemory.heapTotal)}`);
  console.log(`  RSS:        ${formatMemory(finalMemory.rss)}`);
  console.log(`  External:   ${formatMemory(finalMemory.external)}`);

  const heapDelta = finalMemory.heapUsed - initialMemory.heapUsed;
  console.log(`\nHeap Growth: ${formatMemory(Math.abs(heapDelta))} ${heapDelta >= 0 ? '(increased)' : '(decreased)'}`);

  // Save results
  const results = {
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local',
    initial: {
      heapUsed: initialMemory.heapUsed,
      heapTotal: initialMemory.heapTotal,
      rss: initialMemory.rss,
      external: initialMemory.external,
    },
    final: {
      heapUsed: finalMemory.heapUsed,
      heapTotal: finalMemory.heapTotal,
      rss: finalMemory.rss,
      external: finalMemory.external,
    },
    delta: {
      heapUsed: heapDelta,
      heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
      rss: finalMemory.rss - initialMemory.rss,
      external: finalMemory.external - initialMemory.external,
    },
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'memory-benchmark.json'),
    JSON.stringify(results, null, 2)
  );

  console.log(`\n📁 Results saved to: ${OUTPUT_DIR}/memory-benchmark.json\n`);

} catch (error) {
  console.error('❌ Error running memory benchmark:', error.message);
  process.exit(1);
}
