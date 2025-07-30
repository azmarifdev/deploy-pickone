# File Upload Setup for PickOne Project

## Overview
The PickOne project uses Docker volumes to handle file uploads and storage across the server, ensuring data persistence and proper file serving.

## File Storage Structure

### Server-side Storage
Files are stored in the following structure within the container:
```
/tmp/
├── user/               # User profile images
├── products/           # Product images (thumbnails and gallery)
├── description-blocks/ # Product description images
└── reviews/           # Review images
```

### Docker Volumes
- **static-files**: Maps `/tmp` directory for uploaded files
- **uploaded-files**: Additional volume for `/app/uploads` (future use)
- **mongo-data**: Database persistence

## File Upload Flow

1. **Client uploads** → Files received by server
2. **Server processes** → Files saved to `/tmp/[category]/` with unique names
3. **Nginx serves** → Static files served directly via nginx for performance
4. **Fallback** → If nginx can't find file, falls back to Node.js server

## Performance Benefits

### Direct Nginx Serving
- Uploaded files are served directly by nginx instead of going through Node.js
- Includes proper caching headers (1 year expiry)
- CORS headers for cross-origin access
- Reduces server load and improves response times

### Volume Persistence
- Files persist even when containers are restarted
- Shared volume allows nginx to access files uploaded via Node.js
- No data loss during deployments

## File Access URLs
Files are accessible via: `http://your-domain/tmp/[category]/[filename]`

Examples:
- `http://localhost/tmp/user/abc123-profile.jpg`
- `http://localhost/tmp/products/abc123-product-image.jpg`
- `http://localhost/tmp/description-blocks/def456-description.png`

## Environment Requirements

### Development
```bash
# Start all services
docker-compose up --build

# View uploaded files volume
docker volume inspect deploy-pickone_static-files
```

### Production
- Ensure proper backup strategy for `static-files` volume
- Monitor disk space for uploaded files
- Consider CDN integration for better global performance

## Security Features
- File sanitization (special characters removed)
- Unique filename generation (prevents collisions)
- File type validation
- Maximum file size limits (100MB via nginx)

## Troubleshooting

### Files not appearing
1. Check if volume is properly mounted: `docker-compose logs pickone-backend`
2. Verify nginx volume mapping: `docker exec -it nginx ls -la /var/www/uploads`
3. Check file permissions in container: `docker exec -it pickone-backend ls -la /tmp`

### Upload failures
1. Check nginx client_max_body_size setting
2. Verify disk space: `docker system df`
3. Review server logs: `docker-compose logs pickone-backend`

## File Cleanup
Consider implementing periodic cleanup for:
- Orphaned files (files not referenced in database)
- Temporary files older than X days
- Failed upload artifacts 