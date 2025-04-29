# Deployment Guide for GodFullCrm

This guide provides detailed instructions for deploying the GodFullCrm application in various environments.

## Deployment Options

The repository includes several deployment options to accommodate different hosting environments and requirements:

1. **Production Deployment**: Optimized for performance and security
2. **Development Deployment**: Easier to deploy but less optimized
3. **Static Export Deployment**: Maximum compatibility but limited dynamic features
4. **Minimal Deployment**: Simplified deployment for development and testing

## Prerequisites

- Docker and Docker Compose
- Git
- Access to the repository
- Supabase account with project URL and anonymous key

## Environment Variables

The following environment variables are required for all deployment methods:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Deployment with Coolify

### Option 1: Production Deployment (Recommended)

1. Clone the repository
2. Ensure you're on the `master` branch
3. Run the script to use the production Dockerfile:
   ```bash
   ./use-dockerfile.sh production
   ```
4. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Use production Dockerfile"
   git push origin master
   ```
5. In Coolify:
   - Create a new service
   - Select "Docker" as the deployment method
   - Enter your Git repository URL
   - Set the branch to `master`
   - Configure the environment variables
   - Deploy the service

### Option 2: Development Deployment

If the production deployment fails, try the development deployment:

1. Clone the repository
2. Run the script to use the development Dockerfile:
   ```bash
   ./use-dockerfile.sh development
   ```
3. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Use development Dockerfile"
   git push origin master
   ```
4. Redeploy in Coolify

### Option 3: Static Export Deployment

For maximum compatibility but with limited dynamic features:

1. Clone the repository
2. Run the script to use the static Dockerfile:
   ```bash
   ./use-dockerfile.sh static
   ```
3. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Use static Dockerfile"
   git push origin master
   ```
4. Redeploy in Coolify

### Option 4: Minimal Deployment

For a minimal deployment with fewer dependencies:

1. Clone the repository
2. Run the script to use the minimal Dockerfile:
   ```bash
   ./use-dockerfile.sh minimal
   ```
3. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Use minimal Dockerfile"
   git push origin master
   ```
4. Redeploy in Coolify

## Manual Deployment with Docker Compose

To deploy manually using Docker Compose:

1. Clone the repository
2. Choose your deployment option:
   ```bash
   ./use-dockerfile.sh production  # or development, static, minimal
   ```
3. Create a `.env` file with the required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Build and run the application:
   ```bash
   docker-compose up -d
   ```
5. Access the application at http://localhost:3000

## Troubleshooting

### Build Failures

If you encounter build failures:

1. Check the Docker build logs for specific errors
2. Try a different deployment option:
   ```bash
   ./use-dockerfile.sh development  # or static, minimal
   ```
3. Run the debug script to investigate build issues:
   ```bash
   ./debug-build.sh
   ```
4. Check the debug container logs:
   ```bash
   docker logs godcrm-debug-container
   ```
5. Access the debug container shell:
   ```bash
   docker exec -it godcrm-debug-container /bin/sh
   ```

### Common Issues

1. **Out of memory during build**:
   - Try the minimal deployment option
   - Increase the memory limit in the Dockerfile

2. **Missing dependencies**:
   - Check that all dependencies are correctly installed
   - Try using `npm ci` instead of `npm install`

3. **TypeScript errors**:
   - The Dockerfile is configured to ignore TypeScript errors during build
   - If you need to fix TypeScript errors, check the debug container logs

4. **Next.js configuration issues**:
   - The Dockerfile creates a simplified next.config.js
   - If you need to use a custom configuration, modify the Dockerfile

## Updating the Deployment

To update the deployment:

1. Pull the latest changes from the repository
2. Choose your deployment option:
   ```bash
   ./use-dockerfile.sh production  # or development, static, minimal
   ```
3. Rebuild and restart the application:
   ```bash
   docker-compose up -d --build
   ```

## Monitoring and Maintenance

- Check the application logs:
  ```bash
  docker-compose logs -f
  ```
- Monitor the application health:
  ```bash
  docker-compose ps
  ```
- Restart the application:
  ```bash
  docker-compose restart
  ```
- Stop the application:
  ```bash
  docker-compose down
  ```

## Backup and Restore

- Backup the application data:
  ```bash
  docker-compose exec app npm run backup
  ```
- Restore the application data:
  ```bash
  docker-compose exec app npm run restore
  ```

## Security Considerations

- Always use HTTPS in production
- Keep Docker and all dependencies updated
- Use environment variables for sensitive information
- Do not expose unnecessary ports
- Use a non-root user in the container