#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Bundle Analyzer Tool
 * Analyzes the build output and provides insights
 */ 

class BundleAnalyzer {
  constructor(buildDir = './build') {
    this.buildDir = buildDir;
    this.stats = {
      totalSize: 0,
      jsFiles: [],
      cssFiles: [],
      assets: [],
      chunks: {},
    };
  }

  analyze() {
    console.log('🔍 Analyzing bundle...');
    
    if (!fs.existsSync(this.buildDir)) {
      console.error('❌ Build directory not found. Run npm run build first.');
      return;
    }

    this.scanDirectory(this.buildDir);
    this.generateReport();
  }

  scanDirectory(dir, relativePath = '') {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const relativeFilePath = path.join(relativePath, file);

      if (stat.isDirectory()) {
        this.scanDirectory(filePath, relativeFilePath);
      } else {
        this.analyzeFile(filePath, relativeFilePath, stat.size);
      }
    });
  }

  analyzeFile(filePath, relativePath, size) {
    this.stats.totalSize += size;
    
    const ext = path.extname(relativePath);
    const fileName = path.basename(relativePath);

    switch (ext) {
      case '.js':
        this.stats.jsFiles.push({ name: fileName, size, path: relativePath });
        break;
      case '.css':
        this.stats.cssFiles.push({ name: fileName, size, path: relativePath });
        break;
      default:
        this.stats.assets.push({ name: fileName, size, path: relativePath, type: ext });
    }

    // Analyze chunks
    if (fileName.includes('.chunk.')) {
      const chunkName = fileName.split('.')[0];
      if (!this.stats.chunks[chunkName]) {
        this.stats.chunks[chunkName] = { files: [], totalSize: 0 };
      }
      this.stats.chunks[chunkName].files.push({ name: fileName, size });
      this.stats.chunks[chunkName].totalSize += size;
    }
  }

  formatSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  generateReport() {
    console.log('\n📊 Bundle Analysis Report');
    console.log('========================');
    
    console.log(`\n📦 Total Bundle Size: ${this.formatSize(this.stats.totalSize)}`);
    
    // JavaScript files
    console.log('\n🟨 JavaScript Files:');
    this.stats.jsFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .forEach(file => {
        console.log(`  ${file.name}: ${this.formatSize(file.size)}`);
      });

    // CSS files
    if (this.stats.cssFiles.length > 0) {
      console.log('\n🟦 CSS Files:');
      this.stats.cssFiles
        .sort((a, b) => b.size - a.size)
        .forEach(file => {
          console.log(`  ${file.name}: ${this.formatSize(file.size)}`);
        });
    }

    // Chunks analysis
    if (Object.keys(this.stats.chunks).length > 0) {
      console.log('\n🧩 Chunks:');
      Object.entries(this.stats.chunks)
        .sort(([,a], [,b]) => b.totalSize - a.totalSize)
        .forEach(([name, chunk]) => {
          console.log(`  ${name}: ${this.formatSize(chunk.totalSize)} (${chunk.files.length} files)`);
        });
    }

    // Recommendations
    this.generateRecommendations();
  }

  generateRecommendations() {
    console.log('\n💡 Recommendations:');
    
    const largeJsFiles = this.stats.jsFiles.filter(file => file.size > 500000); // > 500KB
    if (largeJsFiles.length > 0) {
      console.log('  ⚠️  Large JavaScript files detected. Consider code splitting.');
    }

    const totalJsSize = this.stats.jsFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalJsSize > 2000000) { // > 2MB
      console.log('  ⚠️  Total JavaScript size is large. Consider lazy loading.');
    }

    if (this.stats.assets.length > 50) {
      console.log('  ⚠️  Many assets detected. Consider asset optimization.');
    }

    console.log('  ✅ Use gzip compression on your server');
    console.log('  ✅ Enable browser caching for static assets');
    console.log('  ✅ Consider using a CDN for better performance');
  }
}

// Run analyzer if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze();
}

module.exports = BundleAnalyzer;
