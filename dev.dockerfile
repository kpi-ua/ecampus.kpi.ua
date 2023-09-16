# Pull official node image
FROM node:16.13.2-buster-slim AS dev-builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to Docker environment
COPY package.json ./

# Installs all node packages
RUN npm install

# Note: No need to COPY all files or run the build command for development

# Add node_modules bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Start the app
CMD ["npm", "start"]
