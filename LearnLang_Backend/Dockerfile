# Use a Node.js base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose the backend API port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]