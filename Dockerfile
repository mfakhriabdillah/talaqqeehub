# ==========================================
# Stage 1: Build the React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to take advantage of Docker caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Declare build arguments for Vite environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Expose them to the build environment so Vite can read them at compile time
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

# Copy the rest of the application source files
COPY . .

# Build the application (produces files in /app/dist)
RUN npm run build

# ==========================================
# Stage 2: Serve the Static Assets with Nginx
# ==========================================
FROM nginx:1.25-alpine

# Set standard port environment variable (overridden dynamically by Cloud Run)
ENV PORT=8080

# Remove default nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy our custom Nginx template configuration for dynamic port binding
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy the built static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 (matching default PORT env)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
