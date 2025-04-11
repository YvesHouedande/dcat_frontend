# # # Use the official Node.js runtime as the base image
# # FROM node:18-alpine AS build
# # WORKDIR /app
# # # COPY .env ./


# # # Copy package.json and package-lock.json to the working directory
# # COPY package.json package-lock.json ./

# # # Install dependencies
# # RUN npm ci --frozen-lockfile && npm cache clean --force

# # # Copy the entire application code to the container
# # COPY . ./

# # # Build the React app for production
# # RUN npm run build

# # # Vérifiez le contenu du répertoire dist
# # RUN ls -la /app/dist  # Vérifiez le contenu du répertoire dist

# # # Use Nginx as the production server
# # FROM nginx:alpine AS production

# # # Créer le répertoire de destination si nécessaire
# # # RUN mkdir -p /usr/share/nginx/html

# # # Copier les fichiers de build générés par le premier stage
# # COPY --from=build /app/dist /usr/share/nginx/html  

# # # # Copier la configuration nginx 
# # COPY ./nginx.conf /etc/nginx/conf.d/default.conf


# # # Exposer le port 8000
# # EXPOSE 8000

# # # Start Nginx when the container runs
# # CMD ["nginx", "-g", "daemon off;"]


# # Use the official Node.js runtime as the base image
# FROM node:18-alpine AS build

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm ci --frozen-lockfile && npm cache clean --force

# # Copy the entire application code to the container
# COPY . ./

# # Build the React app for production
# RUN npm run build

# # Vérifiez le contenu du répertoire dist
# RUN ls -la /app/dist  

# # Use Nginx as the production server
# FROM nginx:alpine AS production

# # Copier les fichiers de build générés par le premier stage
# COPY --from=build /app/dist /usr/share/nginx/html  

# # Copier la configuration nginx 
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# # Exposer le port 8000
# EXPOSE 8000

# # Start Nginx when the container runs
# CMD ["nginx", "-g", "daemon off;"]



# Use the official Node.js runtime as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --frozen-lockfile && npm cache clean --force

# Copy the .env file to the working directory
COPY .env ./

# Copy the entire application code to the container
COPY . ./

# Build the React app for production
RUN npm run build

# Vérifiez le contenu du répertoire dist
RUN ls -la /app/dist  

# Use Nginx as the production server
FROM nginx:alpine AS production

# Copier les fichiers de build générés par le premier stage
COPY --from=build /app/dist /usr/share/nginx/html  

# Copier la configuration nginx 
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 3000
EXPOSE 3000

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]