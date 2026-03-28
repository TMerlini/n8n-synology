# n8n on Docker (Synology & Coolify)

Minimal [Docker Compose](https://docs.docker.com/compose/) stack for [n8n](https://n8n.io/) using the official image [`docker.n8n.io/n8nio/n8n`](https://docs.n8n.io/hosting/installation/docker/).

## What’s in the repo

| File | Purpose |
|------|--------|
| `docker-compose.yml` | n8n service, persistent volume `n8n_data`, port **5678** |
| `.env.example` | Copy to `.env` and adjust host, timezone, and URLs |

## Prerequisites

- Docker with Compose (e.g. Synology **Container Manager**, or any Linux host with Docker)

## Synology (Container Manager)

1. Clone this repo onto the NAS or copy the files into a folder.
2. Copy `.env.example` to `.env` and set your NAS IP or hostname, timezone, and `WEBHOOK_URL` (include trailing slash). For HTTP on the LAN, keep `N8N_SECURE_COOKIE=false`.
3. Create a project from `docker-compose.yml` and start it, or run: `docker compose up -d`.
4. Open `http://<your-nas-ip>:5678` (or your reverse-proxy URL).

## Coolify

1. New resource → **Docker Compose** → point at this repository and branch **`main`**.
2. Assign a domain to service **`n8n`** for container port **5678** (see [Coolify Docker Compose](https://coolify.io/docs/knowledge-base/docker/compose)).
3. For HTTPS behind Coolify’s proxy, set environment variables in the UI (see comments in `.env.example`): e.g. `N8N_PROTOCOL=https`, `N8N_PORT=443`, `N8N_SECURE_COOKIE=true`, `N8N_PROXY_HOPS=1`.

Optional Coolify magic variables (`SERVICE_URL_N8N_5678`, `SERVICE_FQDN_N8N`) are referenced as fallbacks in `docker-compose.yml`; Git-based support needs a recent Coolify v4 (see Coolify docs).

## Data and backups

Workflows and credentials live in the Docker volume **`n8n_data`** (mounted at `/home/node/.n8n` in the container). Back up that volume or your NAS backup that includes it.

## Updating

```bash
docker compose pull
docker compose up -d
```

## References

- [n8n Docker installation](https://docs.n8n.io/hosting/installation/docker/)
- [n8n environment variables](https://docs.n8n.io/hosting/configuration/environment-variables/)
