FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (production + development)
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# -- Production Image -- #
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy the build output from the build stage
COPY --from=builder /app ./

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start"]
