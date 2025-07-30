FROM node:22.0-alpine AS Base

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env .env

RUN npm install

COPY . .

# Compile TypeScript to JS
RUN npm run build

# App listens on port 5000
EXPOSE 5000

# Start the server
CMD [ "npm", "start"]
