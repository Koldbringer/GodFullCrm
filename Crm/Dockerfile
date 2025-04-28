# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/next-i18next.config.js ./

RUN npm ci --legacy-peer-deps --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
