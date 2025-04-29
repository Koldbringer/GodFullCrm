#!/bin/bash

# Script to switch between different Dockerfile versions

if [ "$1" == "standard" ]; then
  echo "Switching to standard Dockerfile..."
  cp Dockerfile.bak Dockerfile.minimal.bak 2>/dev/null || true
  cp Dockerfile.static.bak Dockerfile.static.bak2 2>/dev/null || true
  cp Dockerfile Dockerfile.bak 2>/dev/null || true
  git checkout master -- Dockerfile
  echo "Done. Standard Dockerfile is now active."
elif [ "$1" == "static" ]; then
  echo "Switching to static Dockerfile..."
  cp Dockerfile Dockerfile.bak 2>/dev/null || true
  cp Dockerfile.static Dockerfile
  echo "Done. Static Dockerfile is now active."
elif [ "$1" == "minimal" ]; then
  echo "Switching to minimal Dockerfile..."
  cp Dockerfile Dockerfile.bak 2>/dev/null || true
  cp Dockerfile.minimal Dockerfile
  echo "Done. Minimal Dockerfile is now active."
else
  echo "Usage: $0 [standard|static|minimal]"
  echo "  standard: Use the standard Dockerfile"
  echo "  static: Use the static export Dockerfile"
  echo "  minimal: Use the minimal development Dockerfile"
  exit 1
fi

echo ""
echo "Current Dockerfile content:"
echo "=========================="
cat Dockerfile
echo "=========================="
echo ""
echo "To build and run with this Dockerfile:"
echo "docker-compose build && docker-compose up"