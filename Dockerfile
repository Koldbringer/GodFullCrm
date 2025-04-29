# Build stage
FROM node:18-alpine AS builder

# Set working directory to the Crm subdirectory
WORKDIR /app

# Copy package files from Crm directory
COPY Crm/package*.json ./
# Create empty .npmrc if it doesn't exist
RUN touch .npmrc

# Install dependencies with legacy peer deps for compatibility
RUN npm ci --legacy-peer-deps

# Install missing dependencies
RUN npm install --legacy-peer-deps react-beautiful-dnd fumadocs-core

# Copy the entire Crm directory and the use client script
COPY Crm/ ./
COPY add-use-client.sh /tmp/add-use-client.sh

# Fix React components by adding "use client" directive
RUN chmod +x /tmp/add-use-client.sh && /tmp/add-use-client.sh

# Create default environment variables if not provided
RUN if [ ! -f .env.production ]; then \
    echo "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co" > .env.production && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.production; \
    fi

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy build artifacts from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/.env.production ./.env.production

# Install production dependencies
RUN npm ci --legacy-peer-deps --omit=dev

# Expose port and start the application
EXPOSE 3000

# Create a startup script that can be overridden with environment variables
RUN echo '#!/bin/sh\n\
if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then\n\
  echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" > .env.production\n\
fi\n\
if [ -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then\n\
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" >> .env.production\n\
fi\n\
exec npm start\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
