#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Solana Trading Platform...');

// Check Node.js version
const nodeVersion = process.version;
const requiredVersion = 'v16.0.0';

if (nodeVersion < requiredVersion) {
  console.error(`❌ Node.js ${requiredVersion} or higher is required. Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Create necessary directories
const directories = [
  'build',
  'logs',
  'temp',
  'uploads'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Check if .env exists, if not create from example
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('📋 Created .env file from .env.example');
  console.log('⚠️  Please update .env with your configuration');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Run initial build
console.log('🏗️ Running initial build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Initial build completed');
} catch (error) {
  console.warn('⚠️ Initial build failed, but setup can continue');
}

// Create git hooks (if git is available)
try {
  execSync('git --version', { stdio: 'ignore' });
  
  const preCommitHook = `#!/bin/sh
# Pre-commit hook for Solana Trading Platform

echo "Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix the issues before committing."
  exit 1
fi

# Run tests
npm test -- --watchAll=false
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix the issues before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed"
`;

  const hooksDir = path.join(__dirname, '..', '.git', 'hooks');
  if (fs.existsSync(hooksDir)) {
    const preCommitPath = path.join(hooksDir, 'pre-commit');
    fs.writeFileSync(preCommitPath, preCommitHook);
    fs.chmodSync(preCommitPath, '755');
    console.log('🪝 Git pre-commit hook installed');
  }
} catch (error) {
  console.log('ℹ️ Git not available, skipping git hooks setup');
}

// Generate development certificates (for HTTPS)
const certDir = path.join(__dirname, '..', 'certs');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
  
  try {
    execSync('openssl version', { stdio: 'ignore' });
    
    const certCommands = [
      `openssl req -x509 -newkey rsa:4096 -keyout ${certDir}/key.pem -out ${certDir}/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`
    ];
    
    certCommands.forEach(cmd => {
      execSync(cmd, { stdio: 'ignore' });
    });
    
    console.log('🔒 Development SSL certificates generated');
  } catch (error) {
    console.log('ℹ️ OpenSSL not available, skipping SSL certificate generation');
  }
}

// Create initial configuration files
const configFiles = {
  'jest.config.js': `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
  ],
};`,
  
  'prettier.config.js': `module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};`
};

Object.entries(configFiles).forEach(([filename, content]) => {
  const filePath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`📝 Created ${filename}`);
  }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Update .env with your configuration');
console.log('2. Run "npm start" to start development server');
console.log('3. Run "npm test" to run tests');
console.log('4. Run "npm run build" to create production build');

// Display useful information
console.log('\n📋 Useful commands:');
console.log('  npm start          - Start development server');
console.log('  npm test           - Run tests');
console.log('  npm run build      - Build for production');
console.log('  npm run lint       - Run linting');
console.log('  npm run analyze    - Analyze bundle size');
console.log('  npm run deploy     - Deploy to production');

console.log('\n🔗 Useful links:');
console.log('  Development: http://localhost:3000');
console.log('  Documentation: ./docs/README.md');
console.log('  API Docs: ./docs/api/');
