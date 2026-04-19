# ─── Stage 1: deps ───────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first — this layer is cached unless deps change
COPY package*.json ./
RUN npm ci

# ─── Stage 2: build ──────────────────────────────────────────
# Separate stage so devDependencies (jest, nodemon) never enter runtime
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
# Install ALL deps here (including dev) if you add a build step (TS compile etc.)
# For now we just verify the install is clean
RUN npm ci

COPY src/ ./src/
COPY server.js ./

# ─── Stage 3: runtime ────────────────────────────────────────
FROM node:20-alpine AS runtime

# Security: don't run as root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy app source from build stage
COPY --from=build /app/src ./src
COPY --from=build /app/server.js ./

# Metadata
LABEL org.opencontainers.image.title="url-shortener"
LABEL org.opencontainers.image.source="https://github.com/yourname/url-shortener"

USER appuser

EXPOSE 3000

# Use node directly — not npm start — so signals (SIGTERM) reach your process
CMD ["node", "server.js"]
