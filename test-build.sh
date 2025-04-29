#!/bin/bash

echo "Building Docker image..."
docker build -t godcrm-test .

if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "Running container for testing..."
  docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key --name godcrm-test-container godcrm-test
else
  echo "Build failed!"
  exit 1
fi