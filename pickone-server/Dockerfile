FROM node:22.0-alpine AS Base

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

# Create necessary directories for file uploads
RUN mkdir -p /tmp/user /tmp/products /tmp/description-blocks /tmp/reviews /app/uploads && \
    chmod 755 /tmp /tmp/user /tmp/products /tmp/description-blocks /tmp/reviews /app/uploads

# Compile TypeScript to JS
RUN npm run build

# App listens on port 5000 
EXPOSE 5000

# Start the server
CMD [ "npm", "start"]
