# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project (including .env)
COPY . .

# Expose port
EXPOSE 3000

# Build & start at runtime so DATABASE_URL is available
CMD ["sh", "-c", "npm run build && npm start"]
