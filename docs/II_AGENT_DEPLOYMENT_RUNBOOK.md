# ii-agent Deployment Runbook (Production)

This runbook is for **Agent-ACHEEVY-009** deployment only.

## 1) Prerequisites

- Docker Desktop running
- Ports available: `1420`, `8000`, `8100`, `1236`, `5432`, `6379`
- Valid `OPENROUTER_API_KEY`

## 2) Configure environment

```bash
cp docker/.stack.env.example docker/.stack.env
```

Required minimum values in `docker/.stack.env`:

- `OPENROUTER_API_KEY`
- `DATABASE_URL`
- `SANDBOX_DATABASE_URL`

Recommended for production:

- `PUBLIC_TOOL_SERVER_URL` (public URL if externally reachable)
- `GOOGLE_APPLICATION_CREDENTIALS` (for storage/media integrations)

## 3) Start stack

### Windows PowerShell

```powershell
./scripts/publish_stack.ps1 -Build
```

Optional tunnel profile:

```powershell
./scripts/publish_stack.ps1 -Build -WithTunnel
```

### Bash (Linux/macOS/WSL)

```bash
./scripts/publish_stack.sh --build
```

Optional tunnel profile:

```bash
./scripts/publish_stack.sh --build --with-tunnel
```

## 4) Verify health

- Frontend: `http://localhost:1420`
- Backend health: `http://localhost:8000/health`
- Sandbox health: `http://localhost:8100/health`
- Tool server health: `http://localhost:1236/health`

## 5) Operations

Show status:

```bash
docker compose --project-name ii-agent-stack --env-file docker/.stack.env -f docker/docker-compose.stack.yaml ps
```

Tail backend logs:

```bash
docker compose --project-name ii-agent-stack --env-file docker/.stack.env -f docker/docker-compose.stack.yaml logs -f backend
```

Stop stack:

```bash
docker compose --project-name ii-agent-stack --env-file docker/.stack.env -f docker/docker-compose.stack.yaml down
```

## 6) Common failures

- **`OPENROUTER_API_KEY is missing or placeholder`**
  - Fix key in `docker/.stack.env`, then rerun publish script.
- **Docker daemon unavailable**
  - Start Docker Desktop and retry.
- **Health check timeout**
  - Inspect logs for failing service (`backend`, `sandbox-server`, or `tool-server`).
