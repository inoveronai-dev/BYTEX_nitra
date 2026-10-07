# BYTEX Nitra – CMS / Admin setup

Self-contained CMS: Next.js public site + Slovak `/admin` + SQLite + local uploads. No external CMS or auth provider.

## 1. Architecture

- App: Next.js 16 (`next start` on a persistent VPS)
- DB: SQLite via Drizzle (`better-sqlite3`)
- Files: local directory under `UPLOAD_DIR`
- Auth: bcrypt password hashes + server sessions (HTTP-only cookie)

## 2. SQLite location

Default: `./data/bytex.db`  
Override with `DATABASE_PATH` (absolute path recommended in production).

## 3. Upload location

Default: `./data/uploads/` with subfolders:

`services/`, `references/`, `reconstructions/`, `partners/`, `documents/`, `contacts/`, `hero/`, `general/`

Public URL: `/uploads/...` (served by the app, not raw filesystem paths).

## 4. Environment variables

Copy `.env.example` → `.env.local` (dev) or `/etc/bytex.env` (prod):

| Variable | Purpose |
|---|---|
| `DATABASE_PATH` | SQLite file path |
| `UPLOAD_DIR` | Uploads root |
| `SESSION_SECRET` | Long random secret (required in production) |
| `APP_URL` | Public origin, e.g. `https://bytexnitra.sk` |
| `COOKIE_SECURE` | `true` behind HTTPS |
| `NODE_ENV` | `production` / `development` |

Never commit real secrets.

## 5. Initial admin creation

```bash
npm install
npm run cms:seed          # schema + current website content
npm run admin:create      # interactive email + password
```

## 6. Local development

```bash
cp .env.example .env.local
npm install
npm run cms:seed
npm run admin:create
npm run dev
```

Admin: http://localhost:3000/admin/login

## 7. Production deployment (VPS / Node)

1. Node.js 20+ with build tools for native modules (`better-sqlite3`, `bcrypt`)
2. Persistent directories for DB + uploads (not ephemeral container storage without volumes)
3. Build: `npm ci && npm run build`
4. Process manager: systemd or PM2 running `npm run start` (port 3000)
5. Reverse proxy (Nginx/Caddy) with HTTPS → Node
6. Env file with production `SESSION_SECRET`, `APP_URL`, `COOKIE_SECURE=true`, absolute `DATABASE_PATH` / `UPLOAD_DIR`
7. Permissions: app user owns `data/` (read/write)

Do **not** rely on Vercel’s ephemeral filesystem for production CMS data.

## 8. Backup

```bash
npm run cms:backup
# or: DATABASE_PATH=... UPLOAD_DIR=... BACKUP_DIR=... bash scripts/backup.sh
```

Creates `data/backups/<timestamp>/bytex.db` + `uploads/`. Uses SQLite online `.backup` when `sqlite3` CLI is available.

## 9. Restore

1. Stop the app
2. Replace DB file at `DATABASE_PATH` with backup `bytex.db`
3. Replace `UPLOAD_DIR` contents with backup `uploads/`
4. Start the app
5. Verify `/admin` login and a few public pages

## 10. Admin login URL

- Local: `/admin/login`
- Production: `https://<your-domain>/admin/login`
