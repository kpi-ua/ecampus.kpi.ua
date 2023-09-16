# Pull official node image
FROM node:16.13.2-buster-slim AS dev-builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to Docker environment
COPY package.json ./

# Installs all node packages
RUN npm install

# Add node_modules bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Start the app
CMD ["sh", "-c", "npm start"]
