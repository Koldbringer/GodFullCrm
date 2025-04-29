#!/bin/bash

echo "=== Starting build debugging process ==="

echo "1. Checking repository structure..."
ls -la

echo "2. Checking Crm directory structure..."
ls -la Crm/

echo "3. Checking package.json..."
cat Crm/package.json

echo "4. Checking next.config.mjs..."
if [ -f "Crm/next.config.mjs" ]; then
  cat Crm/next.config.mjs
else
  echo "next.config.mjs not found in Crm directory"
fi

echo "5. Creating a minimal Dockerfile for debugging..."
cat > Dockerfile.debug << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY Crm/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application code
COPY Crm/ ./

# Create minimal next.config.js
RUN echo 'module.exports = {eslint:{ignoreDuringBuilds:true},typescript:{ignoreBuildErrors:true},images:{unoptimized:true}};' > next.config.js

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Debug: List files before build
RUN ls -la

# Try to build
RUN npm run build || echo "Build failed, but continuing for debugging"

# Debug: List files after build attempt
RUN ls -la

# Keep container running for inspection
CMD ["tail", "-f", "/dev/null"]
EOF

echo "6. Building debug container..."
docker build -t godcrm-debug -f Dockerfile.debug .

echo "7. Running debug container..."
docker run -d --name godcrm-debug-container godcrm-debug

echo "8. Inspecting debug container logs..."
docker logs godcrm-debug-container

echo "9. Executing commands inside container for further debugging..."
docker exec godcrm-debug-container ls -la
docker exec godcrm-debug-container find . -name "*.tsx" | grep -i component

echo "=== Debug process completed ==="
echo "To further inspect the container, run: docker exec -it godcrm-debug-container /bin/sh"
echo "To stop and remove the container, run: docker stop godcrm-debug-container && docker rm godcrm-debug-container"