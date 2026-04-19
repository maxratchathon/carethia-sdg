# Family Multi-Request Blueprint (Special Needs Focus)

## Goal
Allow one family account to create and manage multiple care requests over time without locking service choice at sign-up.

Current scope supports only:
- Child Development Support
- Daily Living & Companion Care

## Product Decision
1. Account is permanent identity.
2. Care Request is the matching unit.
3. A family can have many requests:
- Different service types
- Different schedules and budgets
- Different cultural priorities

## User Journey
### A. Sign-up (Family)
Collect only:
- First name
- Last name
- Email
- Password
- Phone
- Preferred language
- Location (city/province)

Do not force service selection here.

### B. First-Time Family Onboarding
After first login, ask:
- What support do you need right now?
  - Child Development Support
  - Daily Living & Companion Care
  - Both
  - Not sure yet

If user picks Not sure yet:
- Show short guided recommender and create draft request.

### C. Create Care Request Flow
Shared Step 1 (all requests):
- Service type
- Start date
- Address / area
- Budget range
- Preferred schedule
- Must-have language(s)

Step 2 branches by service.

Child Development Support fields:
- Child age band
- Primary goals (top 3)
- Condition/context (multi-select)
- Session style preference (structured, play-based, mixed)
- Must-have competencies
- Parent communication/reporting preference

Daily Living & Companion Care fields:
- Recipient age band
- Mobility level
- Support tasks needed (rank top 5)
- Complexity level (low/moderate/high)
- Interaction style preference
- Must-have competencies
- Family reporting preference

Shared Step 3 (culture profile):
- Home language(s)
- Dialect importance (0-100)
- Regional familiarity importance (0-100)
- Cultural continuity priority (low/medium/high)
- Specific practice requirements (free text + checklist)

Step 4:
- Review summary
- Confirm non-negotiables
- Submit request

## Data Model (Request-Centric)
Keep user profile separate from request profile.

### Suggested enums
- ServiceType: CHILD_DEVELOPMENT_SUPPORT | DAILY_LIVING_COMPANION_CARE
- RequestStatus: DRAFT | ACTIVE | PAUSED | FULFILLED | CANCELLED
- FamilyContext: THAI_LOCAL | MIGRANT_HERITAGE | MIXED

### FamilyAccount (new or existing profile extension)
- id
- userId
- preferredLanguage
- city
- province
- createdAt
- updatedAt

### CareRequest (new)
- id
- familyAccountId
- serviceType
- status
- title
- startDate
- locationText
- budgetMin
- budgetMax
- scheduleJson
- mustHaveLanguagesJson
- mustHaveSkillsJson
- niceToHaveSkillsJson
- familyContext
- dialectImportance
- regionalImportance
- culturalPriority
- culturalRequirementsJson
- createdAt
- updatedAt

### ChildDevelopmentProfile (new, one-to-one with CareRequest when serviceType is child)
- careRequestId
- childAgeBand
- goalsJson
- conditionContextJson
- sessionStyle
- parentReportingStyle

### DailyLivingProfile (new, one-to-one with CareRequest when serviceType is daily living)
- careRequestId
- recipientAgeBand
- mobilityLevel
- taskPrioritiesJson
- complexityLevel
- interactionStyle
- familyReportingStyle

### RequestWeights (optional, one-to-one)
- careRequestId
- hardFitWeight (default 0.40)
- serviceFitWeight (default 0.35)
- culturalFitWeight (default 0.25)

## Matching Computation
### Stage A: Eligibility filter (pass/fail)
- Schedule compatibility
- Budget compatibility
- Required language threshold
- Required competencies
- Service availability

Only eligible caregivers continue.

### Stage B: Fit scoring
FinalMatch = 0.40 * RequirementFit + 0.35 * ServiceFit + 0.25 * CulturalFit

Where:
- RequirementFit: normalized score from hard constraints quality (not just pass/fail)
- ServiceFit:
  - Child: goals alignment + profile experience + session style fit
  - Daily living: task competence + complexity handling + interaction fit
- CulturalFit:
  - If familyContext = THAI_LOCAL, apply Thai formula
  - If familyContext = MIGRANT_HERITAGE, apply CAS formula
  - If familyContext = MIXED, blend both

## API Contract (NestJS)
Base path: /family/requests

1) POST /family/requests
Create request draft or active request.

2) GET /family/requests
List requests for logged-in family account.

3) GET /family/requests/:id
Get request details + current match summary.

4) PATCH /family/requests/:id
Update request fields and recompute matching profile.

5) POST /family/requests/:id/activate
Activate draft request.

6) POST /family/requests/:id/pause
Pause active request.

7) POST /family/requests/:id/matches/recompute
Trigger scoring + recommendation regeneration.

8) GET /family/requests/:id/matches
Return ranked caregivers with score breakdown.

### Match response shape (summary)
- caregiverId
- finalMatch
- requirementFit
- serviceFit
- culturalFit
- confidence
- badges
- reasons (top 3)
- potentialGap
- aiRecommendationShort
- aiRecommendationDetailed

## AI Recommendation Strategy
Use deterministic scores first, LLM second.

LLM input:
- request summary
- caregiver profile summary
- score breakdown
- evidence signals (verified language/video/experience)

LLM output requirements:
- one-line recommendation
- top 3 reasons
- one potential risk/gap
- one interview question suggestion

Policy safeguards:
- No ranking by nationality/ethnicity alone
- No sensitive trait inference
- Use only provided profile evidence

## UX Screens
1. Family dashboard
- My Requests list
- New Request button
- Request status chips

2. Request wizard
- Shared basics
- Service-specific form
- Cultural context
- Review and submit

3. Match results page (per request)
- Overall match score
- Requirement/Service/Cultural sub-scores
- Why this match
- Potential gap
- AI recommendation
- Short intro video evidence when available

4. Request detail page
- Edit request
- Duplicate request
- Add second service request
- Pause/close request

## Migration Plan for Existing Codebase
1. Keep current register flow for account creation.
2. Do not add service lock to sign-up.
3. Add family request module in API.
4. Add request wizard in web app after customer login.
5. Route customer dashboard to requests list.
6. Add feature flag to launch new matching incrementally.

## Suggested Phase Plan
Phase 1 (1 sprint):
- CareRequest data model
- Basic request CRUD
- Family dashboard + wizard

Phase 2 (1 sprint):
- Scoring service with breakdown
- Match results page

Phase 3 (1 sprint):
- AI recommendation generation
- Confidence and explanation cards
- Feedback capture loop

## Concrete Fit with Current Project
- API modules currently include auth, user, caregiver, booking, contact.
- Add new API module: family-request.
- Web app already has dashboard route; add request-focused family dashboard there.
- Keep caregiver registration logic unchanged for now, then align fields to scoring engine in later iteration.
