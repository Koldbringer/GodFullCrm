# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY .npmrc ./
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Environment variables must be present at build time
# https://nextjs.org/docs/pages/api-reference/next-config-js/env
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_DISABLE_SUPABASE_AUTH
ARG NEXT_PUBLIC_BASE_URL

# Next.js collects anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js

# Install production dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Create directories for content and make them writable by the nextjs user
RUN mkdir -p /app/content && chown -R nextjs:nodejs /app/content
RUN chown -R nextjs:nodejs /app/public

# Install curl for healthcheck
RUN apk --no-cache add curl

# Switch to non-root user
USER nextjs

# Expose the listening port
EXPOSE 3000

# Run the app
CMD ["npx", "next", "start"]
