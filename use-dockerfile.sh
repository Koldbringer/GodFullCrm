#!/bin/bash

# Script to switch between different Dockerfile versions

# Save the current Dockerfile as production version
if [ "$1" == "save-production" ]; then
  echo "Saving current Dockerfile as production version..."
  cp Dockerfile Dockerfile.production
  echo "Done. Current Dockerfile saved as Dockerfile.production."
  exit 0
fi

# Create a backup of the current Dockerfile
cp Dockerfile Dockerfile.bak 2>/dev/null || true

if [ "$1" == "api-fix" ]; then
  echo "Switching to API-fixed Dockerfile..."
  if [ -f "Dockerfile.api-fix" ]; then
    cp Dockerfile.api-fix Dockerfile
  else
    echo "No API-fixed Dockerfile found. Please create one first."
    exit 1
  fi
  # Update docker-compose.yml for production
  sed -i 's/NODE_ENV=development/NODE_ENV=production/g' docker-compose.yml
  echo "Done. API-fixed Dockerfile is now active."
elif [ "$1" == "production" ]; then
  echo "Switching to production Dockerfile..."
  if [ -f "Dockerfile.production" ]; then
    cp Dockerfile.production Dockerfile
  else
    # If no production Dockerfile exists, use the current one
    echo "No production Dockerfile found. Using current Dockerfile."
  fi
  # Update docker-compose.yml for production
  sed -i 's/NODE_ENV=development/NODE_ENV=production/g' docker-compose.yml
  echo "Done. Production Dockerfile is now active."
elif [ "$1" == "development" ]; then
  echo "Switching to development Dockerfile..."
  cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY Crm/package.json Crm/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY Crm/ ./

# Create .env.development with placeholder values
RUN echo "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co" > .env.development && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.development

# Set environment variables
ENV NODE_ENV=development
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Expose the listening port
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev", "--", "-p", "3000", "--hostname", "0.0.0.0"]
EOF
  # Update docker-compose.yml for development
  sed -i 's/NODE_ENV=production/NODE_ENV=development/g' docker-compose.yml
  echo "Done. Development Dockerfile is now active."
elif [ "$1" == "static" ]; then
  echo "Switching to static Dockerfile..."
  if [ -f "Dockerfile.static" ]; then
    cp Dockerfile.static Dockerfile
  else
    echo "No static Dockerfile found. Creating one..."
    cat > Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY Crm/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY Crm/ ./

# Create a simplified next.config.js
RUN echo 'module.exports = {output:"export",eslint:{ignoreDuringBuilds:true},typescript:{ignoreBuildErrors:true},images:{unoptimized:true}};' > next.config.js

# Build and export as static site
RUN npm run build

# Nginx stage
FROM nginx:alpine

# Copy static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom nginx config
RUN echo 'server { listen 3000; location / { root /usr/share/nginx/html; try_files $uri $uri.html $uri/index.html /index.html; } }' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000
EOF
    cp Dockerfile Dockerfile.static
  fi
  echo "Done. Static Dockerfile is now active."
elif [ "$1" == "minimal" ]; then
  echo "Switching to minimal Dockerfile..."
  if [ -f "Dockerfile.minimal" ]; then
    cp Dockerfile.minimal Dockerfile
  else
    echo "No minimal Dockerfile found. Creating one..."
    cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY Crm/package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy application code
COPY Crm/ ./

# Create minimal next.config.js
RUN echo 'module.exports = {eslint:{ignoreDuringBuilds:true},typescript:{ignoreBuildErrors:true},images:{unoptimized:true}};' > next.config.js

# Set environment variables
ENV NODE_ENV=development

# Run development server
CMD ["npm", "run", "dev", "--", "-p", "3000", "--hostname", "0.0.0.0"]
EOF
    cp Dockerfile Dockerfile.minimal
  fi
  # Update docker-compose.yml for development
  sed -i 's/NODE_ENV=production/NODE_ENV=development/g' docker-compose.yml
  echo "Done. Minimal Dockerfile is now active."
else
  echo "Usage: $0 [production|api-fix|development|static|minimal|save-production]"
  echo "  production: Use the production-optimized Dockerfile"
  echo "  api-fix: Use the production Dockerfile with API route fixes"
  echo "  development: Use the development server Dockerfile"
  echo "  static: Use the static export Dockerfile"
  echo "  minimal: Use the minimal development Dockerfile"
  echo "  save-production: Save current Dockerfile as production version"
  exit 1
fi

echo ""
echo "Current Dockerfile content:"
echo "=========================="
head -n 20 Dockerfile
echo "... (truncated for readability)"
echo "=========================="
echo ""
echo "To build and run with this Dockerfile:"
echo "docker-compose build && docker-compose up -d"