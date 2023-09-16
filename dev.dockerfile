# Pull official node image
FROM node:16.13.2-buster-slim AS dev-builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to Docker environment
COPY package.json ./

# Installs all node packages
RUN npm install

COPY entrypoint-script.sh ./

# Make the script executable
RUN chmod +x ./entrypoint-script.sh

# Add node_modules bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Always run this script when the container starts
#ENTRYPOINT ["./entrypoint-script.sh"]

# Start the app
#CMD ["npm", "start"]

CMD ["bash", "./entrypoint-script.sh"]
