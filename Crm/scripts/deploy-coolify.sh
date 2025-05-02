#!/bin/bash

# Script to prepare and deploy the CRM application to Coolify
# Usage: ./scripts/deploy-coolify.sh

# Ensure we're in the project root
cd "$(dirname "$0")/.." || exit 1

echo "Preparing CRM application for Coolify deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
  echo "Error: .env.production file not found!"
  echo "Please create this file with your production environment variables."
  exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Error: Docker is not installed or not in PATH!"
  exit 1
fi

# Build the Docker image locally to test
echo "Building Docker image locally to test..."
docker build -t godlike-crm:test .

if [ $? -ne 0 ]; then
  echo "Error: Docker build failed!"
  exit 1
fi

echo "Docker image built successfully."

# Check if git is installed
if command -v git &> /dev/null; then
  # Check if we have uncommitted changes
  if [ -n "$(git status --porcelain)" ]; then
    echo "Warning: You have uncommitted changes."
    echo "Consider committing your changes before deploying."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi

  # Suggest creating a git tag for this deployment
  echo "Would you like to create a git tag for this deployment?"
  read -p "Enter tag name (e.g., v1.0.0) or leave empty to skip: " tag_name
  
  if [ -n "$tag_name" ]; then
    git tag -a "$tag_name" -m "Deployment to Coolify on $(date)"
    git push origin "$tag_name"
    echo "Tag $tag_name created and pushed."
  fi
fi

echo
echo "Deployment preparation complete!"
echo
echo "To deploy to Coolify:"
echo "1. Push your changes to your git repository"
echo "2. Log in to your Coolify dashboard"
echo "3. Select your project and click 'Deploy'"
echo
echo "For more detailed instructions, see DEPLOYMENT.md"
