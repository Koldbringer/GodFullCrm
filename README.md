# GodFullCrm - HVAC CRM/ERP System

A comprehensive CRM/ERP system for HVAC companies in the Polish market.

## Features

- Client management pipeline with Kanban board
- Calendar system for scheduling inspections, installations, and service visits
- Dynamic offer generation with AI-assisted pricing
- Call transcription and analysis
- Service management system with reporting
- Invoicing and payment tracking

## Deployment with Coolify

### Prerequisites

- Coolify instance
- Docker and Docker Compose installed
- Git repository access

### Environment Variables

The following environment variables are required for deployment:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Deployment Steps

1. In Coolify, create a new service
2. Select "Docker" as the deployment method
3. Enter your Git repository URL
4. Set the branch to `master`
5. Configure the environment variables
6. Deploy the service

### Troubleshooting

If you encounter build issues:

1. Check the Docker build logs for specific errors
2. Ensure all environment variables are correctly set
3. Verify that the Dockerfile is properly configured
4. Check that the Next.js application is properly configured

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