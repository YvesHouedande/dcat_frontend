# # Use the official Node.js runtime as the base image
# FROM node:18-alpine AS build

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm ci --frozen-lockfile && npm cache clean --force

# # Copy the .env file to the working directory
# COPY .env ./

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

# # Exposer le port 3000
# EXPOSE 3000

# # Start Nginx when the container runs
# CMD ["nginx", "-g", "daemon off;"]



# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Copie package.json + pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Installer pnpm (si pas déjà là)
RUN npm install -g pnpm

# Installer les dépendances (avec pnpm)
RUN pnpm install --frozen-lockfile

# Copier la config d'environnement (optionnel, dépend si utilisé dans le build)
COPY .env ./

# Copier tout le code source (après install pour bien utiliser le layer cache Docker)
COPY . ./

# Build le projet (adapté si vite, next, react-scripts, etc.)
RUN pnpm run build

# Vérifiez le contenu du répertoire dist
RUN ls -la /app/dist

# Production Stage avec NGINX
FROM nginx:alpine AS production

# Copier le build du stage précédent
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la config NGINX personnalisée
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 3000 (adapter au port exposé par nginx dans la config)
EXPOSE 3000

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
