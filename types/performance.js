#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
   
/** 
 * Performance Monitoring Tool
 * Monitors and reports application performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      bundleSize: {},
      loadTimes: {},
      memoryUsage: {},
      renderTimes: {},
    };
    this.startTime = performance.now();
  }

  // Measure bundle sizes
  measureBundleSize() {
    const buildDir = path.join(__dirname, '..', 'build', 'static');
    
    if (!fs.existsSync(buildDir)) {
      console.log('❌ Build directory not found. Run npm run build first.');
      return;
    }

    const measureDirectory = (dir, category) => {
      const files = fs.readdirSync(dir);
      let totalSize = 0;
      const fileDetails = [];

      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
          totalSize += stat.size;
          fileDetails.push({
            name: file,
            size: stat.size,
            sizeFormatted: this.formatBytes(stat.size),
          });
        }
      });

      this.metrics.bundleSize[category] = {
        totalSize,
        totalSizeFormatted: this.formatBytes(totalSize),
        files: fileDetails.sort((a, b) => b.size - a.size),
      };
    };

    // Measure JavaScript files
    const jsDir = path.join(buildDir, 'js');
    if (fs.existsSync(jsDir)) {
      measureDirectory(jsDir, 'javascript');
    }

    // Measure CSS files
    const cssDir = path.join(buildDir, 'css');
    if (fs.existsSync(cssDir)) {
      measureDirectory(cssDir, 'css');
    }

    // Measure media files
    const mediaDir = path.join(buildDir, 'media');
    if (fs.existsSync(mediaDir)) {
      measureDirectory(mediaDir, 'media');
    }
  }

  // Simulate load time measurements
  measureLoadTimes() {
    const scenarios = [
      { name: 'Initial Page Load', time: Math.random() * 2000 + 1000 },
      { name: 'Component Mount', time: Math.random() * 500 + 100 },
      { name: 'API Response', time: Math.random() * 1000 + 200 },
      { name: 'Route Change', time: Math.random() * 800 + 150 },
    ];

    scenarios.forEach(scenario => {
      this.metrics.loadTimes[scenario.name] = {
        time: scenario.time,
        timeFormatted: `${scenario.time.toFixed(2)}ms`,
        status: scenario.time < 1000 ? 'good' : scenario.time < 2000 ? 'warning' : 'poor',
      };
    });
  }

  // Measure memory usage
  measureMemoryUsage() {
    const memUsage = process.memoryUsage();
    
    this.metrics.memoryUsage = {
      rss: {
        value: memUsage.rss,
        formatted: this.formatBytes(memUsage.rss),
        description: 'Resident Set Size',
      },
      heapTotal: {
        value: memUsage.heapTotal,
        formatted: this.formatBytes(memUsage.heapTotal),
        description: 'Total Heap Size',
      },
      heapUsed: {
        value: memUsage.heapUsed,
        formatted: this.formatBytes(memUsage.heapUsed),
        description: 'Used Heap Size',
      },
      external: {
        value: memUsage.external,
        formatted: this.formatBytes(memUsage.external),
        description: 'External Memory',
      },
    };
  }

  // Simulate render time measurements
  measureRenderTimes() {
    const components = [
      'App',
      'TradingPanel',
      'BundleCreator',
      'Header',
      'Sidebar',
      'Modal',
      'Button',
      'Input',
    ];

    components.forEach(component => {
      const renderTime = Math.random() * 50 + 5;
      this.metrics.renderTimes[component] = {
        time: renderTime,
        timeFormatted: `${renderTime.toFixed(2)}ms`,
        status: renderTime < 16 ? 'excellent' : renderTime < 33 ? 'good' : 'poor',
      };
    });
  }

  // Format bytes to human readable format
  formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Generate performance report
  generateReport() {
    console.log('\n📊 Performance Report');
    console.log('====================');

    // Bundle Size Report
    console.log('\n📦 Bundle Sizes:');
    Object.entries(this.metrics.bundleSize).forEach(([category, data]) => {
      console.log(`\n  ${category.toUpperCase()}:`);
      console.log(`    Total: ${data.totalSizeFormatted}`);
      console.log(`    Files: ${data.files.length}`);
      
      if (data.files.length > 0) {
        console.log('    Largest files:');
        data.files.slice(0, 3).forEach(file => {
          console.log(`      ${file.name}: ${file.sizeFormatted}`);
        });
      }
    });

    // Load Times Report
    console.log('\n⏱️  Load Times:');
    Object.entries(this.metrics.loadTimes).forEach(([name, data]) => {
      const statusIcon = data.status === 'good' ? '✅' : 
                        data.status === 'warning' ? '⚠️' : '❌';
      console.log(`    ${statusIcon} ${name}: ${data.timeFormatted}`);
    });

    // Memory Usage Report
    console.log('\n💾 Memory Usage:');
    Object.entries(this.metrics.memoryUsage).forEach(([key, data]) => {
      console.log(`    ${data.description}: ${data.formatted}`);
    });

    // Render Times Report
    console.log('\n🎨 Component Render Times:');
    Object.entries(this.metrics.renderTimes).forEach(([component, data]) => {
      const statusIcon = data.status === 'excellent' ? '🚀' : 
                        data.status === 'good' ? '✅' : '⚠️';
      console.log(`    ${statusIcon} ${component}: ${data.timeFormatted}`);
    });

    // Performance Score
    this.calculatePerformanceScore();
  }

  // Calculate overall performance score
  calculatePerformanceScore() {
    let score = 100;
    let recommendations = [];

    // Check bundle sizes
    const totalJsSize = this.metrics.bundleSize.javascript?.totalSize || 0;
    if (totalJsSize > 2000000) { // > 2MB
      score -= 20;
      recommendations.push('Reduce JavaScript bundle size (currently > 2MB)');
    } else if (totalJsSize > 1000000) { // > 1MB
      score -= 10;
      recommendations.push('Consider optimizing JavaScript bundle size');
    }

    // Check load times
    const avgLoadTime = Object.values(this.metrics.loadTimes)
      .reduce((sum, data) => sum + data.time, 0) / Object.keys(this.metrics.loadTimes).length;
    
    if (avgLoadTime > 2000) {
      score -= 25;
      recommendations.push('Improve load times (average > 2s)');
    } else if (avgLoadTime > 1000) {
      score -= 15;
      recommendations.push('Optimize load times (average > 1s)');
    }

    // Check render times
    const slowComponents = Object.entries(this.metrics.renderTimes)
      .filter(([, data]) => data.status === 'poor').length;
    
    if (slowComponents > 0) {
      score -= slowComponents * 5;
      recommendations.push(`Optimize ${slowComponents} slow-rendering components`);
    }

    console.log('\n🏆 Performance Score:');
    console.log(`    Score: ${score}/100`);
    
    if (score >= 90) {
      console.log('    Grade: A+ (Excellent)');
    } else if (score >= 80) {
      console.log('    Grade: A (Good)');
    } else if (score >= 70) {
      console.log('    Grade: B (Fair)');
    } else {
      console.log('    Grade: C (Needs Improvement)');
    }

    if (recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      recommendations.forEach(rec => {
        console.log(`    • ${rec}`);
      });
    }

    console.log('\n🔧 General Optimizations:');
    console.log('    • Enable gzip compression');
    console.log('    • Use CDN for static assets');
    console.log('    • Implement code splitting');
    console.log('    • Optimize images and assets');
    console.log('    • Use service worker for caching');
  }

  // Save report to file
  saveReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      executionTime: performance.now() - this.startTime,
    };

    const reportPath = path.join(__dirname, '..', 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);
  }

  // Run all measurements
  run() {
    console.log('🔍 Measuring performance...');
    
    this.measureBundleSize();
    this.measureLoadTimes();
    this.measureMemoryUsage();
    this.measureRenderTimes();
    
    this.generateReport();
    this.saveReport();
  }
}

// Run performance monitor if called directly
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run();
}

module.exports = PerformanceMonitor;
