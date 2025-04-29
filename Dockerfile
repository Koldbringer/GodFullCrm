# Optimized Dockerfile for Coolify deployment
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY Crm/package*.json ./
RUN npm ci --legacy-peer-deps

# Copy app source
COPY Crm/ .

# Add missing dependencies
RUN npm install --legacy-peer-deps react-beautiful-dnd

# Build the app
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install necessary tools for health checks
RUN apk add --no-cache wget curl

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/next-i18next.config.js ./

# Set the correct permission for prerender cache
RUN mkdir -p .next/cache
RUN chown -R nextjs:nodejs .next
RUN chmod -R 775 .next

# Expose the listening port
EXPOSE 3000

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Run the app
CMD ["node", "server.js"]