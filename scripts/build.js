#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

// Clean build directory
if (fs.existsSync('build')) {
  console.log('🧹 Cleaning build directory...');
  fs.rmSync('build', { recursive: true, force: true });
}

// Run React build
console.log('📦 Building React application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Copy additional assets
console.log('📋 Copying additional assets...');
const assetsDir = path.join(__dirname, '../assets');
const buildAssetsDir = path.join(__dirname, '../build/assets');

if (fs.existsSync(assetsDir)) {
  if (!fs.existsSync(buildAssetsDir)) {
    fs.mkdirSync(buildAssetsDir, { recursive: true });
  }
  
  fs.readdirSync(assetsDir).forEach(file => {
    fs.copyFileSync(
      path.join(assetsDir, file),
      path.join(buildAssetsDir, file)
    );
  });
}

// Generate build info
const buildInfo = {
  timestamp: new Date().toISOString(),
  version: require('../package.json').version,
  commit: process.env.GITHUB_SHA || 'local',
  branch: process.env.GITHUB_REF || 'local',
};

fs.writeFileSync(
  path.join(__dirname, '../build/build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('🎉 Build process completed!');
console.log(`📊 Build info:`, buildInfo);
