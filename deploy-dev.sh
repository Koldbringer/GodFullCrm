#!/bin/bash

echo "=== Starting development deployment process ==="

# Ensure we're in the repository root
cd "$(dirname "$0")"

# Create a backup of the current Dockerfile
cp Dockerfile Dockerfile.bak 2>/dev/null || true

# Create a development-focused Dockerfile
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

# Create a development-focused docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_SUPABASE_URL
      - NEXT_PUBLIC_SUPABASE_ANON_KEY
    restart: unless-stopped
    volumes:
      - ./Crm:/app
      - /app/node_modules
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
EOF

echo "=== Deployment files created ==="
echo "To deploy, run: docker-compose up -d"
echo "To view logs, run: docker-compose logs -f"
echo "To stop, run: docker-compose down"