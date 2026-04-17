# 🌸 Carethia

Platform connecting families with verified caregivers — babysitting, nursing, elderly care, tutoring & housekeeping.

## ⚡ Quick Start

```bash
git clone <repo-url> && cd carethia
chmod +x setup.sh && ./setup.sh
```

That's it. The script installs deps, copies `.env`, and starts everything.

**Or manually:**

```bash
pnpm install
cp .env.example .env          # edit DATABASE_URL if needed
docker-compose up -d          # start PostgreSQL
pnpm db:migrate               # run migrations
pnpm dev                      # start all servers
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API (Swagger) | http://localhost:3001/api |

## 🏗️ Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, App Router, MUI v5, react-i18next (EN/TH) |
| Backend | NestJS 10, JWT, Swagger |
| Database | PostgreSQL + Drizzle ORM |
| Monorepo | pnpm workspaces |

## 📁 Structure

```
carethia/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared types
│   └── db/           # Drizzle schema & migrations
├── setup.sh          # One-command setup
└── .env.example
```

## 🔑 Scripts

```bash
pnpm dev              # start all (web + api)
pnpm build            # build all
pnpm type-check       # TypeScript check all

# Database
pnpm --filter @carethia/db migrate   # run migrations
pnpm --filter @carethia/db studio    # open Drizzle Studio
pnpm --filter @carethia/db seed      # seed sample data
```

## 🌐 i18n

Supports **English** and **Thai**. Translation files at `apps/web/public/locales/{en,th}/`.  
Language switcher in the navbar — calls `i18n.changeLanguage('th' | 'en')`.

## 🔐 Auth

JWT Bearer tokens · 24h expiry · Swagger UI has "Authorize" button for testing.

## 🚀 Deploy (hackathon fast path)

```bash
# Build
pnpm build

# Frontend → Vercel
# Backend  → Railway / Render
# DB       → Supabase / Railway PostgreSQL
```

## 🆘 Troubleshooting

```bash
# Port in use
lsof -ti :3000 | xargs kill -9

# Fresh install
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install

# DB won't connect → check DATABASE_URL in .env, then:
pnpm db:migrate
```

---

**Built for hackathon** 🎉
