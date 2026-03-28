# n8n on Docker (Synology & Coolify)

Minimal [Docker Compose](https://docs.docker.com/compose/) stack for [n8n](https://n8n.io/) using the official image [`docker.n8n.io/n8nio/n8n`](https://docs.n8n.io/hosting/installation/docker/).

## What’s in the repo

| File | Purpose |
|------|--------|
| `docker-compose.yml` | n8n service, persistent volume `n8n_data`, port **5678** |
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
