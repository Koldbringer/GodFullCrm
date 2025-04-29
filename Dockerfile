FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY Crm/package.json Crm/package-lock.json ./

# Install dependencies with clean npm install
RUN npm install

# Copy the application code
COPY Crm/ ./

# Create .env.production with placeholder values
RUN echo "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co" > .env.production && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.production

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Make build-debug.js executable
RUN chmod +x build-debug.js

# Build the application using the build-debug.js script
RUN node build-debug.js

# Expose the listening port
EXPOSE 3000

# Run the application
CMD ["npx", "next", "start"]
