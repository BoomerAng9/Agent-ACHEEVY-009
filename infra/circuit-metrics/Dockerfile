# Circuit Metrics - Service Health Monitor
FROM node:22-alpine

WORKDIR /app

RUN addgroup -g 1000 metrics && \
    adduser -u 1000 -G metrics -s /bin/sh -D metrics

COPY package.json ./
RUN npm install --only=production && npm cache clean --force

COPY . .
RUN npm run build || npx tsc

USER metrics

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget -q --spider http://localhost:9090/health || exit 1

EXPOSE 9090

CMD ["node", "dist/index.js"]
