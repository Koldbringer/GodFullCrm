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

# Copy the entire Crm directory
COPY Crm/ ./

# Create a script to add "use client" directive to component files
RUN echo '#!/bin/sh' > /tmp/fix-components.sh && \
    echo 'for file in $(find /app/components -type f -name "*.tsx" | xargs grep -l "useState\|useEffect\|useContext\|useReducer\|useCallback\|useMemo\|useRef\|useImperativeHandle\|useLayoutEffect\|useDebugValue"); do' >> /tmp/fix-components.sh && \
    echo '  if ! grep -q "use client" "$file"; then' >> /tmp/fix-components.sh && \
    echo '    sed -i "1s/^/\"use client\";\\n/" "$file"' >> /tmp/fix-components.sh && \
    echo '  fi' >> /tmp/fix-components.sh && \
    echo 'done' >> /tmp/fix-components.sh && \
    echo 'if [ -f "/app/components/offers/OfferGeneratorForm.tsx" ]; then' >> /tmp/fix-components.sh && \
    echo '  if ! grep -q "use client" "/app/components/offers/OfferGeneratorForm.tsx"; then' >> /tmp/fix-components.sh && \
    echo '    sed -i "1s/^/\"use client\";\\n/" "/app/components/offers/OfferGeneratorForm.tsx"' >> /tmp/fix-components.sh && \
    echo '  fi' >> /tmp/fix-components.sh && \
    echo 'fi' >> /tmp/fix-components.sh && \
    chmod +x /tmp/fix-components.sh && \
    /tmp/fix-components.sh || true

# Create default environment variables if not provided
RUN if [ ! -f .env.production ]; then \
    echo "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co" > .env.production && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.production; \
    fi

# Build the Next.js application with error handling
RUN echo '#!/bin/sh' > /tmp/build.sh && \
    echo 'export NODE_OPTIONS="--max_old_space_size=4096"' >> /tmp/build.sh && \
    echo 'npm run build || npm run build || npm run build' >> /tmp/build.sh && \
    chmod +x /tmp/build.sh && \
    /tmp/build.sh

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
