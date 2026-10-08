# BYTEX Nitra – GitHub CMS / Admin setup

Production architecture: **Vercel + GitHub only**. No SQLite, Supabase, Firebase, or external storage.

Flow: Admin UI → Vercel API → GitHub commit (`content/*.json` + `public/uploads/*`) → Vercel redeploy → public site.

## 1. Architecture

- Public site reads committed `content/*.json` and `public/uploads/`
- Admin APIs read/write the latest files via GitHub Contents / Git Data API
- Auth: `ADMIN_EMAIL` + bcrypt `ADMIN_PASSWORD_HASH` + signed HTTP-only cookie (`SESSION_SECRET`)
- CSRF + same-origin checks on mutations; in-memory login rate limit

## 2. Environment variables

Copy `.env.example` → `.env.local` (local) and set the same keys in Vercel:

| Variable | Purpose |
|---|---|
| `APP_URL` | Public origin, e.g. `https://bytexnitra.vercel.app` |
| `SESSION_SECRET` | Long random secret (required in production) |
| `COOKIE_SECURE` | `true` behind HTTPS |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash from `npm run admin:hash-password` |
| `GITHUB_OWNER` | GitHub owner (`inoveronai-dev`) |
| `GITHUB_REPO` | Repo name (`BYTEX_nitra`) |
| `GITHUB_BRANCH` | Branch to commit to (`main` in prod; test branch for previews) |
| `GITHUB_CONTENT_TOKEN` | Fine-grained PAT with Contents **Read and write** |

Never commit secrets. Never use `NEXT_PUBLIC_` for the token.

## 3. GitHub token

1. GitHub → Settings → Developer settings → Fine-grained personal access tokens
2. Repository access: only `BYTEX_nitra`
3. Permissions: **Contents** → Read and write
4. Paste token as `GITHUB_CONTENT_TOKEN` in Vercel (Production + Preview) and local `.env.local`

## 4. Create admin password hash

```bash
npm install
npm run admin:hash-password
# paste output into ADMIN_PASSWORD_HASH
```

## 5. Local development

```bash
cp .env.example .env.local
# fill ADMIN_* and SESSION_SECRET
# optional: fill GITHUB_* to commit against a branch; without token, saves write local content/ files
npm run dev
```

Admin: http://localhost:3000/admin/login

Without `GITHUB_CONTENT_TOKEN`, mutations write to local `content/` and `public/uploads/` (dev only).

## 6. Vercel deployment

1. Connect the GitHub repo to Vercel
2. Set all env vars (Production + Preview)
3. Set `GITHUB_BRANCH=main` for production; use the preview branch name for test branches if needed
4. Deploy — public pages need no GitHub token at runtime for reads (files are in the build)

## 7. Editorial notes

- After save, flash: changes are stored; the public site updates after the Vercel build (usually 1–2 minutes)
- Images are resized/compressed in the browser before upload (≤ ~3 MB); documents ≤ ~4 MB
- External document CDN URLs can stay as URLs in the documents module

## 8. Security checklist

- [ ] Fine-grained PAT scoped to one repo, Contents only
- [ ] `SESSION_SECRET` ≥ 16 random chars
- [ ] `COOKIE_SECURE=true` in production
- [ ] `APP_URL` matches the live origin
- [ ] No secrets in client bundles / committed files
