# Stage 1
#######################################
# Pull official node image
FROM node:16.13.2-buster-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to Docker environment
COPY package.json ./

# Installs all node packages
RUN npm install

# Copies everything over to Docker environment
COPY . ./
RUN npm run build

#Stage 2
#######################################
# Pull the official nginx base image
FROM nginx:1.26

# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static resources
RUN rm -rf ./*

# Copies static resources from builder stage
COPY --from=builder /app/build .
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./start.sh /docker-entrypoint.d

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

STOPSIGNAL SIGQUIT

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]
