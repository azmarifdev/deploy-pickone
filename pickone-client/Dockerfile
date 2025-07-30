FROM node:22.0-alpine

WORKDIR /client

COPY package*.json ./
COPY . .

RUN npm install

# Build the app with standalone output
RUN npm run build

EXPOSE 4000

# Use the standalone server as recommended by Next.js
CMD ["npm", "start"]
