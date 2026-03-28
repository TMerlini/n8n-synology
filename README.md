# n8n on Docker (Synology & Coolify)

Minimal [Docker Compose](https://docs.docker.com/compose/) stack for [n8n](https://n8n.io/) using the official image [`docker.n8n.io/n8nio/n8n`](https://docs.n8n.io/hosting/installation/docker/).

## What’s in the repo

| File | Purpose |
|------|--------|
| `docker-compose.yml` | n8n **official Docker image**, volume `n8n_data`, port **5678** |
| `package.json` / `scripts/start.js` | **Nixpacks** (Coolify default): installs `n8n` from npm and runs `npm start` |
| `nixpacks.toml` | Nixpacks: Node 22, **`npm install`** (avoids fragile `npm ci` on huge trees) |
| `.npmrc` | `legacy-peer-deps=true` so npm install/ci stays reliable |
| `.env.example` | Copy to `.env` and adjust host, timezone, and URLs |

## What you can do with self-hosted n8n

n8n is a **workflow automation** tool: you connect **triggers** (time, webhooks, email, chat, etc.) to **actions** (APIs, databases, files, AI) with optional **logic** (branching, loops, errors, sub-workflows). Self-hosting means the app and (by default) your data run **on your infrastructure**.

### Capabilities

- **Integrations**: hundreds of [built-in nodes](https://docs.n8n.io/integrations/) for CRM, email, spreadsheets, databases, messaging, dev tools, and cloud APIs—plus **HTTP Request** and **Webhook** nodes for any HTTP API.
- **Triggers**: schedules (cron), webhooks, email (IMAP), forms, chat, and many app-specific triggers.
- **Data**: map/transform fields, filter, merge, split, aggregate; JSON, files, and binary data.
- **Control flow**: If/Switch, merge, wait, error workflows, and **sub-workflows** (one workflow calling another).
- **AI**: LangChain-style blocks in the editor—agents, chat models, vector stores, tools, memory—useful for RAG, chatbots, and tool-using assistants (within your API keys and host limits).
- **Code**: **Code node** (JavaScript; Python depends on version/config) and **expressions** across the UI for custom logic.
- **Credentials**: stored **in your instance** (encrypted with your instance key), not on n8n’s servers.
- **Operations**: execution history, retries, debugging (pin data, partial runs); **import/export** workflows as JSON.

### Self-hosting vs n8n Cloud (why run your own)

| Area | What it means |
|------|----------------|
| **Data residency** | Workflows, execution metadata, and credentials stay on **your** server (subject to DB/backups configuration). |
| **Control** | You choose **upgrades**, **backups**, and how to **expose** the UI (VPN, reverse proxy, TLS). |
| **Limits** | Bounded by **your CPU/RAM/disk** and third-party **API rate limits**—not n8n Cloud plan quotas. |
| **Webhooks** | External systems call **your** public URL once DNS/HTTPS and `WEBHOOK_URL` are set correctly. |
| **Customization** | Env vars, proxies, optional Postgres/Redis, queue mode for larger setups ([hosting overview](https://docs.n8n.io/hosting/)). |

### Typical use cases

- Sync between tools (CRM ↔ spreadsheet ↔ database).
- Alerts and reporting (monitoring, digests, Slack/Teams).
- Lead/ticket routing from forms, email, or chat.
- File and media pipelines (fetch, transform, store).
- DevOps glue (Git events, CI hooks, internal APIs).
- AI-assisted flows (summarize, classify, route content, internal Q&A on your data).

### Your responsibilities

- **Security**: HTTPS in production, strong access controls; avoid exposing the editor widely without hardening; patch n8n and the host.
- **Backups**: volume/DB backups; understand **encryption key** loss—without it, stored credentials/workflows can be unrecoverable.
- **Updates**: you apply image updates; read [release notes](https://docs.n8n.io/release-notes/) for breaking changes.
- **Compliance**: self-hosting does not automatically satisfy regulations—you still design access, logging, and retention.

### Community vs Enterprise

The open-source self-hosted edition covers typical automation needs. **Enterprise** adds features such as advanced SSO, source control across environments, and org-oriented tooling—only if you need that tier.

## Prerequisites

- Docker with Compose (e.g. Synology **Container Manager**, or any Linux host with Docker)

## Synology (Container Manager)

1. Clone this repo onto the NAS or copy the files into a folder.
2. Copy `.env.example` to `.env` and set your NAS IP or hostname, timezone, and `WEBHOOK_URL` (include trailing slash). For HTTP on the LAN, keep `N8N_SECURE_COOKIE=false`.
3. Create a project from `docker-compose.yml` and start it, or run: `docker compose up -d`.
4. Open `http://<your-nas-ip>:5678` (or your reverse-proxy URL).

## Coolify

Two supported ways to deploy; pick one.

### A. Nixpacks (Coolify default — “Application”)

Coolify’s default **Nixpacks** build pack detects Node from `package.json`, runs install → `npm run build` → `npm start` ([Nixpacks Node](https://nixpacks.com/docs/providers/node)). This repo uses **`npm install --legacy-peer-deps`** (see `nixpacks.toml`) instead of `npm ci` so large dependency trees stay reliable; there is **no `package-lock.json`** in the repo on purpose.

This repo installs the [`n8n` npm package](https://docs.n8n.io/hosting/installation/npm/) and starts it; `scripts/start.js` maps Coolify’s `PORT` to `N8N_PORT`.

1. **New resource** → **Application** (or Public Git) → repo **main**, build pack **Nixpacks** (default).
2. **Base directory**: `/`.
3. Set the same env vars as in the compose path for HTTPS (see below): `TZ`, `GENERIC_TIMEZONE`, `N8N_PROTOCOL`, `N8N_PORT` (often `443` behind proxy), `WEBHOOK_URL`, `N8N_SECURE_COOKIE`, `N8N_PROXY_HOPS`, etc.
4. **Persist data**: unlike Docker Compose, there is no named volume unless you add one in Coolify. Map a **persistent storage** directory to n8n’s data folder (by default under the app user’s home, e.g. `~/.n8n`), or set [`N8N_USER_FOLDER`](https://docs.n8n.io/hosting/configuration/environment-variables/deployment/) to a mounted path—otherwise workflows/credentials can be lost on redeploy.

**Note:** The Nixpacks path installs n8n via **npm** (large install). The **Docker Compose** path uses the **official image** and is usually smaller/faster to deploy and matches [n8n’s Docker docs](https://docs.n8n.io/hosting/installation/docker/) exactly.

### B. Docker Compose (official image)

Use the **Docker Compose** build pack ([docs](https://coolify.io/docs/builds/packs/docker-compose)) if you want the pre-built image only:

1. **Build pack**: **Docker Compose** (not Nixpacks).
2. **Base directory**: `/`, **Docker Compose Location**: `docker-compose.yml`.
3. Assign a domain to service **`n8n`** on container port **5678** ([exposing services](https://coolify.io/docs/knowledge-base/docker/compose)).
4. Env vars for HTTPS (e.g. `N8N_PROTOCOL=https`, `N8N_PORT=443`, `N8N_SECURE_COOKIE=true`, `N8N_PROXY_HOPS=1`) — see `.env.example`.

Magic variables `SERVICE_URL_N8N_5678` / `SERVICE_FQDN_N8N` in `docker-compose.yml` need a recent Coolify v4 for Git-based deploys.

## Data and backups

- **Docker Compose:** workflows and credentials live in the volume **`n8n_data`** (`/home/node/.n8n` in the container). Back up that volume.
- **Nixpacks / npm:** data is under the n8n user folder (default `~/.n8n` unless `N8N_USER_FOLDER` is set). Configure **persistent storage** in Coolify (or equivalent) so redeploys do not wipe it.

## Updating

**Docker Compose:**

```bash
docker compose pull
docker compose up -d
```

**Nixpacks:** bump the `n8n` version in `package.json`, commit, redeploy; or use a range and redeploy to pick up patches per your policy.

## References

- [n8n Docker installation](https://docs.n8n.io/hosting/installation/docker/)
- [n8n environment variables](https://docs.n8n.io/hosting/configuration/environment-variables/)
