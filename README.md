# GodFullCrm

A comprehensive CRM/ERP system for HVAC companies in the Polish market, built with Next.js and Supabase.

## Deployment with Coolify

This repository is configured for easy deployment with Coolify. Follow these steps to deploy:

### Prerequisites

1. A Coolify instance up and running
2. Access to a PostgreSQL database (can be hosted on Coolify or externally)
3. Supabase project (for authentication and storage)

### Deployment Steps

1. In Coolify, create a new service and select "Deploy from Git repository"
2. Connect to this repository and select the `main` branch
3. Coolify will automatically detect the Docker configuration
4. Set the required environment variables (see `.env.example` for reference):
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `NEXTAUTH_SECRET`: A random string for NextAuth session encryption
   - `NEXTAUTH_URL`: The URL where your app will be deployed

5. Deploy the service

### Health Checks

The application includes a health check endpoint at `/api/health` that Coolify will use to monitor the application status.

## Development

To run the application locally:

```bash
cd Crm
npm install --legacy-peer-deps
npm run dev
```

## Docker

To build and run with Docker:

```bash
docker-compose up --build
```

The application will be available at http://localhost:3000.

## Features

- Customer management
- Service order tracking
- Inventory management
- Technician scheduling
- Offline map functionality
- Reporting and analytics
- Mobile-friendly interface
