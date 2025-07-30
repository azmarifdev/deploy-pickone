# Docker Setup Guide for Pickone Web App

This guide explains how to set up the Pickone web application with Docker and nginx proxy.

## Architecture Overview

- **nginx**: Reverse proxy server (port 80)
- **pickone-client**: Next.js client app (port 4000)
- **pickone-admin**: Next.js admin dashboard (port 3000)
- **pickone-backend**: Node.js/Express API server (port 5000)
- **mongodb**: MongoDB database (port 27017)

## Environment Variables Setup

### 1. Root Directory (.env)
Create a `.env` file in the root directory:

```env
# Database Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=pickone_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=365d

# Server Configuration
PORT=5000
NODE_ENV=production
```

### 2. Client App (pickone-client/.env.local)
Create a `.env.local` file in the `pickone-client` directory:

```env
# API Base URL - Points to nginx proxy
NEXT_PUBLIC_API_KEY=http://localhost

# Optional: Facebook Pixel ID
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_facebook_pixel_id

# Optional: Google Analytics ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id
```

### 3. Admin App (pickone-admin/.env.local)
Create a `.env.local` file in the `pickone-admin` directory:

```env
# API Base URL - Points to nginx proxy
NEXT_PUBLIC_BASE_URL=http://localhost
```

## Nginx Proxy Configuration

The nginx configuration routes traffic as follows:

- `http://localhost/` → Client App (pickone-client:4000)
- `http://localhost/admin/` → Admin Dashboard (pickone-admin:3000)
- `http://localhost/api/` → Backend API (pickone-backend:5000)

## Running the Application

1. **Clone and navigate to the project directory**
2. **Create the environment files** as described above
3. **Build and start all services:**

```bash
docker-compose up --build
```

4. **Access the applications:**
   - Client App: http://localhost
   - Admin Dashboard: http://localhost/admin
   - API Documentation: http://localhost/api
   - Health Check: http://localhost/health

## Key Features

### Security
- Security headers (X-Frame-Options, XSS-Protection, etc.)
- Content Security Policy

### Performance
- Gzip compression for static assets
- Static file caching (1 year expiration)
- Optimized timeout settings

### Monitoring
- Health check endpoint at `/health`
- Error page handling (404, 50x)

## Troubleshooting

### Common Issues

1. **API calls not working:**
   - Ensure environment variables are set correctly
   - Check that all services are running: `docker-compose ps`

2. **Admin dashboard not loading:**
   - Verify the admin service is accessible at port 3000
   - Check nginx configuration for `/admin/` routing

3. **Static files not loading:**
   - Ensure Next.js apps are built properly
   - Check nginx static file serving configuration

### Logs

View service logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs pickone-client
docker-compose logs pickone-admin
docker-compose logs pickone-backend
docker-compose logs nginx
```

## Development vs Production

### Development
- Use `NODE_ENV=development`
- API URLs point to `http://localhost` (nginx proxy)

### Production
- Use `NODE_ENV=production`
- Update API URLs to your domain
- Add SSL configuration to nginx
- Set up proper database credentials

## Next Steps

1. Set up SSL certificates for HTTPS
2. Configure domain name in nginx
3. Set up monitoring and logging
4. Configure backup for MongoDB
5. Set up CI/CD pipeline 