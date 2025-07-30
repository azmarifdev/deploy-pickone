# PickOne Project - VPS Deployment Guide

## 🎯 **Deployment Overview**

This guide will help you deploy the PickOne project to your VPS server (103.213.38.213) with the following access points:

- **Client Site**: `http://103.213.38.213` (Main e-commerce site)
- **Admin Panel**: `http://103.213.38.213/admin` (Admin dashboard)
- **API/Server**: `http://103.213.38.213/server` or `http://103.213.38.213/api` (Backend API)

## 📋 **Prerequisites**

### Server Requirements
- **VPS Server**: Ubuntu 20.04+ (or similar Linux distribution)
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB free space
- **IP Address**: 103.213.38.213
- **Access**: Root/sudo access with password

### Required Software
- Docker Engine
- Docker Compose
- Git
- UFW Firewall (optional but recommended)

## 🚀 **Step-by-Step Deployment Process**

### **Step 1: Connect to Your VPS Server**

```bash
# Connect via SSH (replace with your actual username if not root)
ssh root@103.213.38.213

# Or if using a specific user:
ssh username@103.213.38.213
```

### **Step 2: Update Server and Install Dependencies**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git ufw

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to docker group (if not root)
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
docker-compose --version
```

### **Step 3: Configure Firewall (Recommended)**

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (important - don't lock yourself out!)
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check firewall status
sudo ufw status
```

### **Step 4: Clone and Setup Project**

```bash
# Navigate to desired directory
cd /home

# Clone the repository
git clone https://github.com/azmarifdev/deploy-pickone.git

# Navigate to project directory
cd deploy-pickone

# Verify files are present
ls -la
```

### **Step 5: Create Environment Files**

Create the required `.env` files for each service:

#### **Root .env file**
```bash
nano .env
```

Add the following content:
```env
# Database Configuration
DB_NAME=pickone_db
DB_USERNAME=pickone_admin
DB_PASSWORD=your_secure_password_here

# Node Environment
NODE_ENV=development

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=365d

# File Upload Configuration
LOCAL_FILE_URL=http://103.213.38.213/

# Facebook Conversion API (optional)
FB_ACCESS_TOKEN=your_fb_access_token
FB_PIXEL_ID=your_fb_pixel_id
```

#### **Server .env file**
```bash
nano pickone-server/.env
```

Add the same content as the root `.env` file.

#### **Admin .env file**
```bash
nano pickone-admin/.env
```

Add:
```env
NEXT_PUBLIC_BASE_URL=http://103.213.38.213/api
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://103.213.38.213/admin
```

#### **Client .env file**
```bash
nano pickone-client/.env
```

Add:
```env
NEXT_PUBLIC_BASE_URL=http://103.213.38.213/api
NEXT_PUBLIC_FRONTEND_URL=http://103.213.38.213
```

### **Step 6: Build and Deploy**

```bash
# Build and start all services
docker-compose up --build -d

# Check if all services are running
docker-compose ps

# View logs to ensure everything started correctly
docker-compose logs
```

### **Step 7: Verify Deployment**

#### **Check Service Status**
```bash
# Check all containers
docker ps

# Check specific service logs
docker-compose logs pickone-client
docker-compose logs pickone-admin
docker-compose logs pickone-backend
docker-compose logs mongodb
docker-compose logs nginx
```

#### **Test Access Points**

1. **Client Site**: Open `http://103.213.38.213` in browser
2. **Admin Panel**: Open `http://103.213.38.213/admin` in browser
3. **API Health**: Visit `http://103.213.38.213/api/health` or `http://103.213.38.213/server/health`

### **Step 8: Database Setup (First Time Only)**

```bash
# Access the MongoDB container
docker exec -it mongodb mongo

# Or if authentication is enabled:
docker exec -it mongodb mongo -u pickone_admin -p your_secure_password_here

# Create initial admin user (via API or admin panel)
# Visit http://103.213.38.213/admin and create your first admin account
```

## 🔧 **Post-Deployment Configuration**

### **SSL Certificate (Production)**
For production deployment with domain:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### **Domain Configuration**
Update the following files when you get a domain:

1. **nginx.conf**: Update `server_name` to your domain
2. **Environment files**: Replace IP with domain name
3. **CORS settings**: Add your domain to allowed origins

### **Performance Optimization**

```bash
# Enable log rotation
sudo nano /etc/logrotate.d/docker-containers

# Add monitoring (optional)
sudo apt install htop iotop

# Set up automatic updates (optional)
sudo apt install unattended-upgrades
```

## 🛠️ **Management Commands**

### **Basic Operations**
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart pickone-backend

# View real-time logs
docker-compose logs -f

# Update and rebuild
git pull
docker-compose up --build -d
```

### **Database Backup**
```bash
# Backup database
docker exec mongodb mongodump --out /backup

# Restore database
docker exec mongodb mongorestore /backup
```

### **File Management**
```bash
# Check uploaded files
docker exec pickone-backend ls -la /tmp

# Clean up unused Docker resources
docker system prune -f
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using port 80
sudo netstat -tulpn | grep :80

# Stop conflicting service
sudo systemctl stop apache2  # or nginx
```

#### **Permission Issues**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /home/deploy-pickone
chmod +x /home/deploy-pickone
```

#### **Memory Issues**
```bash
# Check memory usage
free -h
docker stats

# Restart services with memory limit
docker-compose up -d --scale pickone-backend=1
```

#### **CORS Issues**
- Verify IP address in `pickone-server/src/app/middleware/cors.ts`
- Check environment variables in client applications
- Ensure browser is accessing the correct URL

### **Log Locations**
```bash
# Application logs
docker-compose logs [service-name]

# System logs
sudo journalctl -u docker.service

# Nginx access logs
docker exec nginx tail -f /var/log/nginx/access.log
```

## 📊 **Monitoring**

### **Health Checks**
```bash
# Quick health check script
#!/bin/bash
echo "=== PickOne Health Check ==="
echo "Client: $(curl -s -o /dev/null -w "%{http_code}" http://103.213.38.213)"
echo "Admin: $(curl -s -o /dev/null -w "%{http_code}" http://103.213.38.213/admin)"
echo "API: $(curl -s -o /dev/null -w "%{http_code}" http://103.213.38.213/api/health)"
echo "==========================="
```

### **Resource Monitoring**
```bash
# Container resource usage
docker stats --no-stream

# Disk usage
df -h
docker system df
```

## 🔐 **Security Checklist**

- [ ] Change default passwords in `.env` files
- [ ] Enable firewall (UFW)
- [ ] Regular system updates
- [ ] Use strong JWT secrets
- [ ] Enable MongoDB authentication
- [ ] Set up SSL certificates for production
- [ ] Regular database backups
- [ ] Monitor system logs

## 📞 **Support**

### **Useful Commands for Support**
```bash
# Export system information
docker-compose config > debug-compose.yml
docker ps -a > debug-containers.txt
docker-compose logs > debug-logs.txt
```

### **Environment Information**
- **Server IP**: 103.213.38.213
- **Operating System**: Linux
- **Docker Version**: Latest
- **Project Version**: Current main branch

---

## 🎉 **Success!**

If all steps completed successfully, your PickOne application should now be running on:

- **🛍️ Client Store**: http://103.213.38.213
- **⚙️ Admin Panel**: http://103.213.38.213/admin  
- **🔌 API Endpoint**: http://103.213.38.213/api

The system is now ready for development and testing. Remember to implement SSL and domain configuration for production use!

---

**Next Steps**: 
1. Create your first admin user through the admin panel
2. Configure your store settings
3. Add your first products
4. Test the complete flow from client to admin

**For Production**: 
1. Obtain a domain name
2. Set up SSL certificates
3. Update environment configurations
4. Implement backup strategies
5. Set up monitoring and alerts 