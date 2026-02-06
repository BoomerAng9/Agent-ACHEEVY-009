#!/usr/bin/env bash
# =============================================================================
# A.I.M.S. Production Deployment Script
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/infra/docker-compose.prod.yml"
ENV_FILE="${SCRIPT_DIR}/infra/.env.production"
ENV_EXAMPLE="${SCRIPT_DIR}/infra/.env.production.example"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info()  { printf "${GREEN}[INFO]${NC}  %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
error() { printf "${RED}[ERROR]${NC} %s\n" "$1"; }

# -----------------------------------------------------------------------------
# Pre-flight checks
# -----------------------------------------------------------------------------
info "Running pre-flight checks..."

if ! command -v docker &> /dev/null; then
    error "docker is not installed. Please install Docker first."
    exit 1
fi

if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    error "docker compose is not available. Please install Docker Compose."
    exit 1
fi

info "Using compose command: ${COMPOSE_CMD}"

# -----------------------------------------------------------------------------
# Environment file
# -----------------------------------------------------------------------------
if [ ! -f "${ENV_FILE}" ]; then
    warn ".env.production not found. Copying from .env.production.example..."
    cp "${ENV_EXAMPLE}" "${ENV_FILE}"
    warn "IMPORTANT: Edit ${ENV_FILE} with your actual production values before proceeding."
    warn "Then re-run this script."
    exit 1
fi

info "Environment file found: ${ENV_FILE}"

# -----------------------------------------------------------------------------
# Build
# -----------------------------------------------------------------------------
info "Building production images..."
${COMPOSE_CMD} -f "${COMPOSE_FILE}" build

# -----------------------------------------------------------------------------
# Deploy
# -----------------------------------------------------------------------------
info "Starting production containers..."
${COMPOSE_CMD} -f "${COMPOSE_FILE}" up -d

# -----------------------------------------------------------------------------
# Status
# -----------------------------------------------------------------------------
echo ""
info "=========================================="
info " A.I.M.S. Production Deployment Complete"
info "=========================================="
echo ""
${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps
echo ""
info "Services:"
info "  - nginx (reverse proxy) : http://localhost:80"
info "  - frontend (Next.js)    : internal :3000"
info "  - uef-gateway (API)     : internal :3001"
echo ""
info "Useful commands:"
info "  Logs:    ${COMPOSE_CMD} -f ${COMPOSE_FILE} logs -f"
info "  Stop:    ${COMPOSE_CMD} -f ${COMPOSE_FILE} down"
info "  Restart: ${COMPOSE_CMD} -f ${COMPOSE_FILE} restart"
echo ""
