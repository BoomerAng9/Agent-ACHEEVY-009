# Agent Bridge - Security Gateway
# Bridges AIMS network and sandboxed agents with strict security controls
# Compatible with OpenClaw v2026.2.3

FROM node:24-alpine

WORKDIR /app

# Security: Create non-root user
RUN addgroup -g 1000 bridge && \
    adduser -u 1000 -G bridge -s /bin/sh -D bridge

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Copy source
COPY . .

# Build TypeScript
RUN npm run build || npx tsc

# Security: Switch to non-root user
USER bridge

# Environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -q --spider http://localhost:3010/health || exit 1

EXPOSE 3010

CMD ["node", "dist/index.js"]
