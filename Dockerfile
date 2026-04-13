# Use a lightweight Node.js Alpine base image
FROM node:18-alpine

# Set overall working directory
WORKDIR /app

# ----------------------------------------
# 1. Build the Frontend (React/Vite)
# ----------------------------------------
# Create directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY ahmed-adel/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY ahmed-adel/ ./

# Build the frontend bundle
RUN npm run build

# ----------------------------------------
# 2. Setup the Backend (Express)
# ----------------------------------------
# Create directory for backend
WORKDIR /app/server

# Copy backend package files
COPY ahmed-adel-api/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend source code
COPY ahmed-adel-api/ ./

# Create uploads directory for image persistence (if local used fallback Cloudinary)
RUN mkdir -p uploads

# ----------------------------------------
# 3. Combine Frontend & Backend 
# ----------------------------------------
# Copy the built React app into the backend directory so Express can serve it
# Note: Express server.js expects the build inside a folder named 'client'
RUN cp -r /app/frontend/dist /app/server/client

# Set final working directory to where the server lives
WORKDIR /app/server

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=3000

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
