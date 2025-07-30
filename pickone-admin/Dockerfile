FROM node:22.0-alpine 
WORKDIR /src
COPY package*.json ./

COPY . .
RUN npm install

# Build the app with standalone output
RUN npm run build

# App listens on port 3000
EXPOSE 3000

# Use the standalone server as recommended by Next.js
CMD ["npm", "start"]

