#!/bin/bash

# Check if Dockerfile.static exists
if [ ! -f "Dockerfile.static" ]; then
  echo "Dockerfile.static not found!"
  exit 1
fi

# Backup the current Dockerfile
cp Dockerfile Dockerfile.regular

# Replace the current Dockerfile with the static version
cp Dockerfile.static Dockerfile

echo "Switched to static build Dockerfile."
echo "To switch back, run: cp Dockerfile.regular Dockerfile"