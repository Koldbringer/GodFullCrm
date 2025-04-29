#!/bin/bash

# Coolify deployment script
echo "Starting Coolify deployment process..."

# Install curl for healthchecks
apk add --no-cache curl

# Check if environment variables are set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "ERROR: NEXT_PUBLIC_SUPABASE_URL is not set"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
  exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "ERROR: NEXTAUTH_SECRET is not set"
  exit 1
fi

if [ -z "$NEXTAUTH_URL" ]; then
  echo "ERROR: NEXTAUTH_URL is not set"
  exit 1
fi

echo "All required environment variables are set"
echo "Starting application..."

# Start the application
exec "$@"