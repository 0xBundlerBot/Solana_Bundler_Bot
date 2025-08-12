#!/bin/bash

# Deployment script for Solana Trading Platform
# Usage: ./scripts/deploy.sh [environment] 

set -e 

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-staging}

echo -e "${BLUE}🚀 Starting deployment to ${ENVIRONMENT}...${NC}"

# Validate environment
case $ENVIRONMENT in
    "staging"|"production"|"development")
        echo -e "${GREEN}✅ Environment: ${ENVIRONMENT}${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid environment: ${ENVIRONMENT}${NC}"
        echo "Valid environments: staging, production, development"
        exit 1
        ;;
esac

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        exit 1
    fi
}

echo -e "${BLUE}🔍 Checking required tools...${NC}"
check_tool "node"
check_tool "npm"
check_tool "git"

# Check Node.js version
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js version: ${NODE_VERSION}${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️ You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get current branch and commit
BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git rev-parse --short HEAD)
echo -e "${GREEN}📋 Branch: ${BRANCH}, Commit: ${COMMIT}${NC}"

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    echo -e "${GREEN}📋 Loading environment variables from .env.${ENVIRONMENT}${NC}"
    export $(cat .env.${ENVIRONMENT} | xargs)
elif [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️ Using default .env file${NC}"
    export $(cat .env | xargs)
else
    echo -e "${YELLOW}⚠️ No environment file found${NC}"
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci --production=false

# Run tests
if [ "$ENVIRONMENT" != "development" ]; then
    echo -e "${BLUE}🧪 Running tests...${NC}"
    npm test -- --coverage --watchAll=false
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Tests failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ All tests passed${NC}"
fi

# Run linting
echo -e "${BLUE}🔍 Running linting...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Linting failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Linting passed${NC}"

# Build application
echo -e "${BLUE}🏗️ Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build completed${NC}"

# Run bundle analysis
echo -e "${BLUE}📊 Analyzing bundle...${NC}"
if [ -f "tools/analyzer.js" ]; then
    node tools/analyzer.js
fi

# Create deployment package
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="solana-trading-platform-${ENVIRONMENT}-${TIMESTAMP}.tar.gz"

echo -e "${BLUE}📦 Creating deployment package: ${PACKAGE_NAME}${NC}"
tar -czf ${PACKAGE_NAME} \
    build/ \
    package.json \
    package-lock.json \
    README.md \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=src \
    --exclude=tests

# Deploy based on environment
case $ENVIRONMENT in
    "staging")
        echo -e "${BLUE}🚀 Deploying to staging...${NC}"
        # Add staging deployment commands here
        # Example: rsync, scp, or cloud provider CLI
        ;;
    "production")
        echo -e "${BLUE}🚀 Deploying to production...${NC}"
        # Add production deployment commands here
        # Example: AWS S3, Vercel, Netlify, etc.
        ;;
    "development")
        echo -e "${BLUE}🚀 Development deployment...${NC}"
        # Just start the development server
        npm start
        ;;
esac

# Health check
health_check() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}🏥 Running health check on ${url}...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "${url}/health" > /dev/null; then
            echo -e "${GREEN}✅ Health check passed${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Attempt ${attempt}/${max_attempts} failed, retrying...${NC}"
        sleep 5
        ((attempt++))
    done
    
    echo -e "${RED}❌ Health check failed after ${max_attempts} attempts${NC}"
    return 1
}

# Run health check if URL is provided
if [ ! -z "$HEALTH_CHECK_URL" ]; then
    health_check $HEALTH_CHECK_URL
fi

# Send notification
send_notification() {
    local status=$1
    local message="Solana Trading Platform deployment to ${ENVIRONMENT} ${status}"
    
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"${message}\"}" \
            $SLACK_WEBHOOK_URL
    fi
    
    if [ ! -z "$DISCORD_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"content\":\"${message}\"}" \
            $DISCORD_WEBHOOK_URL
    fi
}

# Cleanup
echo -e "${BLUE}🧹 Cleaning up...${NC}"
rm -f ${PACKAGE_NAME}

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}📋 Summary:${NC}"
echo -e "  Environment: ${ENVIRONMENT}"
echo -e "  Branch: ${BRANCH}"
echo -e "  Commit: ${COMMIT}"
echo -e "  Timestamp: ${TIMESTAMP}"

send_notification "completed successfully"
