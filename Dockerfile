# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY bun.lockb ./
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GEMINI_API_KEY
ARG VITE_API_KEY
ARG VITE_OPENROUTER_API_KEY
ARG OPENROUTER_API_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY
ENV OPENROUTER_API_KEY=$OPENROUTER_API_KEY
COPY . .
RUN npm ci && npm run build

# Stage 2: Production runtime
FROM node:20-alpine
WORKDIR /app

# Install Oracle Instant Client dependencies
RUN apk add --no-cache libaio libc6-compat

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built app and server
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Expose port (Cloud Run will set PORT environment variable)
EXPOSE 8080

# Start the server
CMD ["npm", "start"] 