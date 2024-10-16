# Use the official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (e.g., 3000)
EXPOSE 443

# Define environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["node", "./webServer.js"]
