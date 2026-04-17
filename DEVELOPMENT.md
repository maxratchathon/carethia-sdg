# Carethia - Development Guide

## Project Overview

**Carethia** is a women-focused home support ecosystem connecting verified caregivers with families needing services like babysitting, nursing, tutoring, and housekeeping.

**Tech Stack**: Next.js + NestJS + Drizzle ORM + PostgreSQL (Monorepo with pnpm)

## Setup Instructions

### 1. Prerequisites
```bash
# Verify you have these installed
node --version  # v18+ required
pnpm --version  # v8+ required
# PostgreSQL should be running (locally or Docker)
```

### 2. Install Dependencies
```bash
cd /Users/maxmerock/repo/carethia
pnpm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env and set DATABASE_URL:
# DATABASE_URL=postgresql://user:password@localhost:5432/carethia
```

### 4. Database Setup
```bash
# Generate and run migrations
pnpm db:migrate

# (Optional) Seed sample data
pnpm db:seed

# View database in UI
pnpm --filter @carethia/db studio
```

### 5. Start Development
```bash
# Start all services (frontend + backend)
pnpm dev

# Or start individually:
pnpm --filter @carethia/web dev    # Frontend on :3000
pnpm --filter @carethia/api dev    # Backend on :3001
```

## Services

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js application |
| API | http://localhost:3001 | NestJS backend |
| API Docs | http://localhost:3001/api | Swagger documentation |
| Database Studio | `pnpm --filter @carethia/db studio` | Drizzle Studio |

## Folder Structure & What to Build

### Frontend (`apps/web/src`)

**Key files to implement:**

1. **pages/index.tsx** - Homepage (✅ Basic template done)
   - [ ] Add feature cards
   - [ ] Add CTA buttons
   - [ ] Connect to API

2. **pages/login.tsx** - NEW
   - [ ] Email/password form
   - [ ] Call `/auth/login` endpoint
   - [ ] Store JWT token

3. **pages/register.tsx** - NEW
   - [ ] Registration form
   - [ ] User type selection (customer/caregiver)
   - [ ] Call `/auth/register` endpoint

4. **pages/dashboard.tsx** - NEW
   - [ ] User profile display
   - [ ] Quick actions
   - [ ] Recent bookings

5. **pages/caregivers/index.tsx** - NEW
   - [ ] List all caregivers
   - [ ] Filters (service type, rating, price)
   - [ ] Call `/caregivers` endpoint

6. **pages/caregivers/[id].tsx** - NEW
   - [ ] Caregiver details
   - [ ] Reviews
   - [ ] Booking button

7. **pages/booking/[caregiverId].tsx** - NEW
   - [ ] Booking form
   - [ ] Date/time picker
   - [ ] Service selection
   - [ ] Call `/bookings` POST endpoint

8. **components/** - UI Components
   - [ ] Header/Navigation
   - [ ] CaregiverCard
   - [ ] BookingForm
   - [ ] ReviewCard
   - [ ] LoadingSpinner
   - [ ] ErrorBoundary

### Backend (`apps/api/src`)

**Key files to implement:**

1. **auth/** - Authentication
   - [ ] auth.controller.ts - register, login endpoints
   - [ ] auth.service.ts - JWT logic, password hashing
   - [ ] jwt.strategy.ts - Passport JWT strategy
   - [ ] auth.guard.ts - Auth middleware

2. **user/** - User Management
   - [ ] user.controller.ts - GET /me, PUT /profile
   - [ ] user.service.ts - User queries & updates
   - [ ] user.dto.ts - Data transfer objects

3. **caregiver/** - Caregiver Profiles
   - [ ] caregiver.controller.ts - CRUD endpoints
   - [ ] caregiver.service.ts - Business logic
   - [ ] caregiver.dto.ts - DTOs

4. **booking/** - Booking System
   - [ ] booking.controller.ts - CRUD endpoints
   - [ ] booking.service.ts - Booking logic
   - [ ] booking.dto.ts - DTOs

5. **review/** - Reviews & Ratings
   - [ ] review.controller.ts - Create/read reviews
   - [ ] review.service.ts - Review logic

## Recommended Implementation Order

### Priority 1 (Essential for MVP)
1. **Auth System**
   - Implement login/register endpoints
   - Add password hashing (bcrypt)
   - Test with Postman/Swagger

2. **Caregiver Profiles**
   - GET all caregivers with filters
   - GET single caregiver details
   - Display on frontend

3. **Booking System**
   - Create booking endpoint
   - List user bookings
   - Update booking status

### Priority 2 (Core Features)
4. **Reviews & Ratings**
5. **User Dashboard**
6. **Search & Filtering**
7. **Bilingual UI**

### Priority 3 (Polish)
8. **Error handling**
9. **Validation**
10. **Testing**
11. **Deployment**

## Example: Building a Feature

### Example: Implement Caregiver Listing

**1. Backend (NestJS)**
```typescript
// apps/api/src/caregiver/caregiver.controller.ts
import { Controller, Get, Query } from '@nestjs/common'
import { CaregiverService } from './caregiver.service'

@Controller('caregivers')
export class CaregiverController {
  constructor(private caregiverService: CaregiverService) {}

  @Get()
  async getAll(@Query('service') service?: string) {
    return this.caregiverService.getAll(service)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.caregiverService.getById(parseInt(id))
  }
}
```

**2. Frontend (Next.js)**
```typescript
// apps/web/src/pages/caregivers/index.tsx
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Grid, Card, CardContent, Typography } from '@mui/material'

export default function CaregiversList() {
  const [caregivers, setCaregivers] = useState([])

  useEffect(() => {
    api.get('/caregivers').then(setCaregivers)
  }, [])

  return (
    <Grid container spacing={2}>
      {caregivers.map(caregiver => (
        <Grid item xs={12} sm={6} md={4} key={caregiver.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {caregiver.user.firstName}
              </Typography>
              <Typography color="textSecondary">
                Rating: {caregiver.overallRating}/5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
```

**3. Database Already Ready**
The schema is already defined in [packages/db/src/schema.ts](packages/db/src/schema.ts)

## Common Tasks

### Add a new API endpoint
```typescript
// 1. Create DTO (apps/api/src/myfeature/my.dto.ts)
export class CreateMyFeatureDto {
  @IsString() name: string
  @IsNumber() count: number
}

// 2. Create service (apps/api/src/myfeature/my.service.ts)
@Injectable()
export class MyFeatureService {
  async create(dto: CreateMyFeatureDto) {
    // Business logic
  }
}

// 3. Create controller (apps/api/src/myfeature/my.controller.ts)
@Controller('my-feature')
export class MyFeatureController {
  @Post()
  create(@Body() dto: CreateMyFeatureDto) {
    return this.service.create(dto)
  }
}

// 4. Register in module (apps/api/src/my-feature/my-feature.module.ts)
@Module({
  controllers: [MyFeatureController],
  providers: [MyFeatureService],
})
export class MyFeatureModule {}
```

### Add a new page to frontend
```typescript
// apps/web/src/pages/new-page.tsx
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function NewPage() {
  const { t } = useTranslation('common')
  return <div>{t('title')}</div>
}

export async function getStaticProps({ locale }) {
  return {
    props: await serverSideTranslations(locale, ['common']),
  }
}
```

## Testing the API

### Using Swagger UI (Recommended)
1. Go to http://localhost:3001/api
2. Try out endpoints directly
3. See request/response

### Using Postman/cURL
```bash
# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Get caregivers
curl http://localhost:3001/caregivers
```

## Debugging

### Frontend
- Open DevTools: F12
- Check Network tab for API calls
- Console for errors

### Backend
- Check terminal logs
- Use Swagger UI to test endpoints
- Add `console.log()` for debugging

### Database
- Use Drizzle Studio: `pnpm --filter @carethia/db studio`
- View/edit data directly
- Check migrations

## Tips for Hackathon Success

1. **Start with MVP** - Don't build everything, focus on core features
2. **Separate concerns** - Backend API, Frontend UI, Database
3. **Test early** - Use Swagger UI to test backend before frontend
4. **Mock data** - Use sample data to develop UI independently
5. **TypeScript** - Catch errors before runtime
6. **Deploy early** - Test in production-like environment
7. **Document** - Comments on complex logic
8. **Communicate** - Split tasks among team members

## Useful Commands

```bash
# Install new package in specific workspace
pnpm add --filter @carethia/web axios

# Build for production
pnpm build

# Type check all
pnpm type-check

# Format code
pnpm --filter @carethia/api lint

# View database schema
pnpm --filter @carethia/db studio

# Run migrations
pnpm db:migrate

# Clean everything
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

## Resources

- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle Docs](https://orm.drizzle.team)
- [MUI Docs](https://mui.com)
- [i18next Docs](https://www.i18next.com)

---

Good luck with your hackathon! 🚀
