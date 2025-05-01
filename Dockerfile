# Stage 1: Builder
FROM node:22.13.0-slim AS builder

# Set the working directory
WORKDIR /app

# Install python and libstdc++6 for debugging
RUN apt-get update && apt-get install -y --no-install-recommends \
    make g++ python3 && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install --ignore-scripts

# Copy the application source code
COPY /public/ /app/public
COPY /src/ /app/src
COPY .env jest.config.ts jest.setup.ts next-env.d.ts next.config.mjs postcss.config.js tailwind.config.ts tsconfig.json /app/

# Build the application
RUN npm run build

# Stage 2: Final-stage
FROM node:22.13.0-slim

# Set the working directory
WORKDIR /app

# Install nano and libstdc++6 for debugging
RUN apt-get update && \
    apt-get install -y --no-install-recommends nano libstdc++6 && \
    rm -rf /var/lib/apt/lists/*

# Copy everything from the builder stage
COPY --from=builder /app /app

# Create a non-root user and group, then set permissions in a single step
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app/.next /app/public && \
    chmod -R u+w /app/.next /app/public

# Switch to the non-root user
USER appuser

EXPOSE 3000

CMD ["npm", "start"]
