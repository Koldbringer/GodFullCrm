# GodFullCrm - HVAC CRM/ERP System

A comprehensive CRM/ERP system for HVAC companies in the Polish market.

## Features

- Client management pipeline with Kanban board
- Calendar system for scheduling inspections, installations, and service visits
- Dynamic offer generation with AI-assisted pricing
- Call transcription and analysis
- Service management system with reporting
- Invoicing and payment tracking

## Deployment Options

### Development Mode Deployment (Recommended for Coolify)

This approach runs the Next.js development server directly, which is more reliable for deployment but may have slightly slower performance.

#### Prerequisites

- Coolify instance
- Docker and Docker Compose installed
- Git repository access

#### Environment Variables

The following environment variables are required for deployment:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

#### Deployment Steps

1. In Coolify, create a new service
2. Select "Docker" as the deployment method
3. Enter your Git repository URL
4. Set the branch to `master`
5. Configure the environment variables
6. Deploy the service

The current Dockerfile and docker-compose.yml are configured to run in development mode, which should work reliably with Coolify.

### Production Build Deployment

If you want to deploy a production build instead of the development server:

1. Clone the repository
2. Run the script to switch to the production build: `./use-dockerfile.sh standard`
3. Commit and push the changes: `git commit -am "Switch to production build" && git push origin master`
4. Redeploy in Coolify

### Static Export Deployment

For maximum reliability but with limited dynamic features:

1. Clone the repository
2. Run the script to switch to the static build: `./use-dockerfile.sh static`
3. Commit and push the changes: `git commit -am "Switch to static build" && git push origin master`
4. Redeploy in Coolify

The static build uses Nginx to serve pre-rendered static HTML files, which can be more reliable but has some limitations with dynamic features.

### Minimal Deployment

For a minimal deployment with fewer dependencies:

1. Clone the repository
2. Run the script to switch to the minimal build: `./use-dockerfile.sh minimal`
3. Commit and push the changes: `git commit -am "Switch to minimal build" && git push origin master`
4. Redeploy in Coolify

### Manual Deployment with Docker Compose

To deploy manually using Docker Compose:

1. Clone the repository
2. Create a `.env` file with the required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run `docker-compose up -d`
4. Access the application at http://localhost:3000

### Troubleshooting

If you encounter build issues:

1. Check the Docker build logs for specific errors
2. Ensure all environment variables are correctly set
3. Try running the development server with `./deploy-dev.sh` and then `docker-compose up -d`
4. If the development server works but production build fails, use the development server for deployment
5. For persistent issues, try the static export deployment option

#### Debug Build Process

To debug the build process:
```bash
# Run the debug script
./debug-build.sh

# Check the logs
docker logs godcrm-debug-container

# Access the container shell for further debugging
docker exec -it godcrm-debug-container /bin/sh
```

## Development

### Setup

1. Clone the repository
2. Navigate to the `Crm` directory
3. Install dependencies with `npm install`
4. Create a `.env.local` file with the required environment variables
5. Run the development server with `npm run dev`

### Project Structure

- `/Crm`: Main Next.js application
- `/Crm/app`: Next.js app directory
- `/Crm/components`: React components
- `/Crm/lib`: Utility functions and API helpers
- `/Crm/public`: Static assets
- `/Crm/styles`: CSS and styling files
- `/Crm/types`: TypeScript type definitions