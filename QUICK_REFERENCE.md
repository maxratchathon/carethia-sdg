# Carethia - Quick Reference

## 🚀 Commands Cheatsheet

```bash
# Initial setup
pnpm install

# Development
pnpm dev                          # Start all services
pnpm dev --filter @carethia/web  # Frontend only
pnpm dev --filter @carethia/api  # Backend only

# Building
pnpm build                         # Build all
pnpm type-check                    # Type check all

# Database
pnpm db:migrate                    # Run migrations
pnpm db:seed                       # Seed data
pnpm --filter @carethia/db studio # Open Drizzle Studio

# Linting
pnpm lint
pnpm format
```

## 📂 File Locations

| What | Where |
|------|-------|
| Frontend pages | `apps/web/src/pages/` |
| Frontend components | `apps/web/src/components/` |
| Frontend utilities | `apps/web/src/lib/` |
| Backend controllers | `apps/api/src/*/` |
| Database schema | `packages/db/src/schema.ts` |
| Shared types | `packages/shared/src/index.ts` |
| Environment vars | `.env` |

## 🔌 Key Endpoints (when running)

- Frontend: http://localhost:3000
- API: http://localhost:3001
- API Swagger: http://localhost:3001/api
- Database UI: Run `pnpm --filter @carethia/db studio`

## 💾 Database Tables

- `users` - All users
- `customers` - Customer profiles
- `caregivers` - Caregiver profiles & verification
- `bookings` - Service bookings
- `reviews` - Ratings & feedback
- `subscriptions` - Recurring services

## 🎨 Frontend Tech Stack

- **Framework**: Next.js 14
- **UI**: Material-UI (MUI)
- **i18n**: i18next (English + Arabic)
- **HTTP**: Fetch API (see `src/lib/api.ts`)

## 🔧 Backend Tech Stack

- **Framework**: NestJS
- **Auth**: JWT + Passport
- **Database Client**: Drizzle ORM
- **Docs**: Swagger/OpenAPI

## 📦 Adding Dependencies

```bash
# Frontend
pnpm add --filter @carethia/web package-name

# Backend
pnpm add --filter @carethia/api package-name

# Shared
pnpm add --filter @carethia/shared package-name

# Database
pnpm add --filter @carethia/db package-name
```

## 🌍 Translations

English: `apps/web/public/locales/en/`
Arabic: `apps/web/public/locales/ar/`

Add new keys to both language files!

## 🧪 Testing Endpoints

Use Swagger UI at http://localhost:3001/api

Or with curl:
```bash
curl http://localhost:3001/caregivers
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

## ⚙️ Environment Variables

Key variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - Authentication secret
- `API_PORT` - Backend port (3001)
- `NEXT_PUBLIC_API_URL` - Frontend API URL

## 🐛 Debugging

**Frontend**: DevTools (F12)
**Backend**: Console logs + Swagger
**Database**: Drizzle Studio

## 📚 Key Files to Understand

1. `packages/db/src/schema.ts` - Database structure
2. `packages/shared/src/index.ts` - Shared types
3. `apps/api/src/app.module.ts` - Backend modules
4. `apps/web/src/pages/index.tsx` - Frontend routing
5. `apps/web/src/lib/api.ts` - API client

## 🎯 MVP Features

- [ ] User authentication
- [ ] Caregiver profiles
- [ ] Booking system
- [ ] Reviews & ratings
- [ ] Search & filtering
- [ ] User dashboard
- [ ] Bilingual UI

## 🔒 Security Notes

- Never commit `.env` file
- JWT tokens expire in 24 hours
- Password hashing required (use bcrypt)
- CORS enabled for frontend URL
- Validation on all endpoints

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Database won't connect | Check DATABASE_URL in .env |
| Port in use | Change port in .env or kill process |
| Dependencies missing | Run `pnpm install` |
| TypeScript errors | Run `pnpm type-check` |
| Migrations fail | Check PostgreSQL is running |

## 📞 Getting Help

- Check DEVELOPMENT.md for detailed guide
- Check ROADMAP.md for feature checklist
- Look at code comments
- Use Swagger UI to test endpoints

---

Happy building! 🚀
