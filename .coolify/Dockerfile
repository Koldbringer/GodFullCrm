# Simple Dockerfile for Coolify
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY ../Crm/package*.json ./
RUN npm ci --legacy-peer-deps

# Copy app source
COPY ../Crm/ .

# Add missing dependencies
RUN npm install --legacy-peer-deps react-beautiful-dnd fumadocs-core

# Build the app
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install necessary tools for health checks
RUN apk add --no-cache wget curl

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/next-i18next.config.js ./

# Expose the listening port
EXPOSE 3000

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Run the app
CMD ["node", "server.js"]