## Carethia MVP Roadmap

### Phase 1: MVP (Week 1)
- [x] Project setup & monorepo configuration
- [x] Database schema & Drizzle ORM setup
- [ ] User authentication (register/login)
- [ ] Caregiver profile creation
- [ ] Basic booking system
- [ ] Review & rating system
- [ ] Frontend home page & navigation
- [ ] Bilingual UI support (EN/AR)

### Phase 2: Core Features (Week 1-2)
- [ ] Caregiver search & filtering
- [ ] Smart matching algorithm
- [ ] Safety verification status display
- [ ] Subscription management
- [ ] User dashboard
- [ ] Booking history & management

### Phase 3: Platform Features (Week 2)
- [ ] Background check workflow
- [ ] Certification uploads
- [ ] Admin verification panel
- [ ] Analytics dashboard
- [ ] Real-time notifications
- [ ] Payment integration (Stripe)

### Phase 4: Polish & Deployment
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment
- [ ] Documentation

## Quick Implementation Checklist

### Backend Priority
- [ ] User CRUD endpoints
- [ ] Authentication service
- [ ] Caregiver CRUD
- [ ] Booking CRUD
- [ ] Review creation
- [ ] Search/filter endpoint

### Frontend Priority
- [ ] Login page
- [ ] Caregiver listing page
- [ ] Booking form
- [ ] User dashboard
- [ ] Caregiver profile page
- [ ] Review submission

### Database Priority
- [ ] Run migrations
- [ ] Seed test data
- [ ] Create indexes
- [ ] Test relationships

## Getting Started Now

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup database**
   ```bash
   # Update DATABASE_URL in .env
   pnpm db:migrate
   pnpm --filter @carethia/db studio
   ```

3. **Start development**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - Swagger Docs: http://localhost:3001/api

## Architecture Decisions

### Monorepo with pnpm
- ✅ Faster development with shared dependencies
- ✅ Easy code sharing between frontend & backend
- ✅ Single version control
- ✅ Unified build & deploy

### NestJS for Backend
- ✅ Enterprise-grade framework
- ✅ Built-in validation & DI
- ✅ Good for scalability
- ✅ JWT auth out of the box

### Next.js for Frontend
- ✅ SSR-capable for better SEO
- ✅ API routes if needed
- ✅ Excellent performance
- ✅ Easy deployment

### Drizzle ORM
- ✅ Type-safe queries
- ✅ Easy migrations
- ✅ PostgreSQL native
- ✅ Better than Prisma for complex queries

### PostgreSQL
- ✅ ACID compliance
- ✅ JSON support
- ✅ Relationships
- ✅ Production-ready

## Notes for Hackathon

- Focus on MVP features first
- Use mock data if backend isn't ready
- Prioritize user experience
- Keep authentication simple initially
- Use Swagger UI for API testing
- Deploy early to catch issues
