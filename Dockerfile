# Use the official Node.js image from the Docker Hub
FROM node:latest

# Set the working directory in the container
WORKDIR .

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Copy the rest of your application code
COPY . .

# Expose the port that the app runs on
EXPOSE 443

# Command to run the application
CMD [ "node", "webserver.js" ]
