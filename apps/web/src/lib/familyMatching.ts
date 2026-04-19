import { mockCaregivers, type MockCaregiver } from '@/lib/mockData'
import { profileToCard } from '@/lib/caregiverUtils'
import {
    getAllCaregiverProfiles,
    type StoredCareRequest,
    type FamilyContextType,
    type SpecialNeedsServiceType,
} from '@/lib/store'

export interface CaregiverMatchResult {
    caregiverId: number
    caregiverName: string
    caregiverAvatar: string
    caregiverHourlyRate: number
    serviceType: SpecialNeedsServiceType
    finalMatch: number
    requirementFit: number
    serviceFit: number
    culturalFit: number
    confidence: number
    badges: string[]
    reasons: string[]
    potentialGap: string
    aiRecommendationShort: string
    aiRecommendationDetailed: string[]
}

function clampScore(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)))
}

function toSearchableProfile(caregiver: MockCaregiver): string {
    return [
        ...caregiver.specialties,
        ...caregiver.certifications,
        ...caregiver.languages,
        caregiver.service,
        ...caregiver.services,
    ]
        .join(' ')
        .toLowerCase()
}

function hasAnyToken(text: string, tokens: string[]): boolean {
    return tokens.some((token) => text.includes(token))
}

function getNormalizedWeights(request: StoredCareRequest): {
    requirementWeight: number
    serviceWeight: number
    culturalWeight: number
} {
    const requirementRaw = Math.max(0, request.matchWeightRequirement ?? 40)
    const serviceRaw = Math.max(0, request.matchWeightService ?? 35)
    const culturalRaw = Math.max(0, request.matchWeightCultural ?? 25)

    const total = requirementRaw + serviceRaw + culturalRaw
    if (total <= 0) {
        return {
            requirementWeight: 0.4,
            serviceWeight: 0.35,
            culturalWeight: 0.25,
        }
    }

    return {
        requirementWeight: requirementRaw / total,
        serviceWeight: serviceRaw / total,
        culturalWeight: culturalRaw / total,
    }
}

function getFamilyContextBoost(
    context: FamilyContextType,
    caregiver: MockCaregiver,
    request: StoredCareRequest,
): number {
    if (context === 'THAI_LOCAL') {
        const thaiLanguageBoost = caregiver.languages.includes('Thai') ? 25 : -20
        const regionalBoost = caregiver.city === request.locationCity ? 20 : 5
        return thaiLanguageBoost + regionalBoost
    }

    if (context === 'MIGRANT_HERITAGE') {
        const multilingualBoost = caregiver.languages.length >= 2 ? 20 : 4
        const culturalExperienceBoost = caregiver.specialties.some((s) => s.toLowerCase().includes('autism') || s.toLowerCase().includes('dementia')) ? 10 : 0
        return multilingualBoost + culturalExperienceBoost
    }

    const mixedBoost = caregiver.languages.length >= 2 ? 18 : 8
    return mixedBoost + (caregiver.city === request.locationCity ? 8 : 0)
}

function getCaregiverPool(): MockCaregiver[] {
    const dynamicCards = getAllCaregiverProfiles().map(profileToCard)
    const seenIds = new Set(mockCaregivers.map((c) => c.id))
    const uniqueDynamic = dynamicCards.filter((c) => !seenIds.has(c.id))
    return [...mockCaregivers, ...uniqueDynamic]
}

function getEligibilityScore(caregiver: MockCaregiver, request: StoredCareRequest): number {
    let score = 40

    if (caregiver.hourlyRate >= request.budgetMin && caregiver.hourlyRate <= request.budgetMax) {
        score += 30
    }

    if (request.schedule.includes(caregiver.shift ?? 'DAY') || caregiver.shift === 'BOTH') {
        score += 20
    }

    if (request.mustHaveLanguages.length === 0) {
        score += 10
    } else {
        const required = request.mustHaveLanguages.map((lang) => lang.toLowerCase())
        const spoken = caregiver.languages.map((lang) => lang.toLowerCase())
        const hasAtLeastOneRequired = required.some((lang) => spoken.includes(lang))
        if (hasAtLeastOneRequired) score += 10
    }

    return clampScore(score)
}

function getServiceFitScore(caregiver: MockCaregiver, request: StoredCareRequest): number {
    let score = 20

    if (caregiver.service === request.serviceType) score += 35
    if (caregiver.services.includes(request.serviceType)) score += 15

    const skillsText = toSearchableProfile(caregiver)

    for (const skill of request.mustHaveSkills) {
        if (skillsText.includes(skill.toLowerCase())) score += 5
    }

    for (const skill of request.niceToHaveSkills) {
        if (skillsText.includes(skill.toLowerCase())) score += 3
    }

    if (request.serviceType === 'SPECIAL_NEEDS_TRAINER' && caregiver.specialties.some((s) => s.toLowerCase().includes('speech') || s.toLowerCase().includes('sensory'))) {
        score += 8
    }

    if (request.serviceType === 'DAILY_LIVING_COMPANION' && caregiver.specialties.some((s) => s.toLowerCase().includes('mobility') || s.toLowerCase().includes('companion') || s.toLowerCase().includes('dementia'))) {
        score += 8
    }

    score += getServiceSpecificSignalScore(caregiver, request, skillsText)

    return clampScore(score)
}

function getServiceSpecificSignalScore(
    caregiver: MockCaregiver,
    request: StoredCareRequest,
    profileText: string,
): number {
    let signal = 0

    if (request.serviceType === 'SPECIAL_NEEDS_TRAINER') {
        const goalTokens: Record<string, string[]> = {
            'Communication/language': ['speech', 'language', 'communication'],
            'Social interaction': ['social', 'group', 'play'],
            'Routine independence': ['routine', 'daily living', 'self-care', 'self care'],
            'Behavior regulation': ['behavior', 'aba', 'autism'],
            'Sensory integration': ['sensory', 'occupational'],
        }

        const conditionTokens: Record<string, string[]> = {
            'Autism spectrum': ['autism', 'aba', 'asd'],
            ADHD: ['adhd', 'attention', 'behavior'],
            'Speech/language delay': ['speech', 'language'],
            'Global developmental delay': ['development', 'developmental'],
            'Learning differences': ['learning', 'education'],
        }

        for (const goal of request.childGoals ?? []) {
            if (goalTokens[goal] && hasAnyToken(profileText, goalTokens[goal])) signal += 4
        }

        for (const condition of request.childConditions ?? []) {
            if (conditionTokens[condition] && hasAnyToken(profileText, conditionTokens[condition])) signal += 5
        }

        if (request.childSessionStyle === 'STRUCTURED') {
            signal += caregiver.experience >= 4 ? 3 : 0
        }
        if (request.childSessionStyle === 'PLAY_BASED') {
            signal += hasAnyToken(profileText, ['play', 'creative', 'activity']) ? 3 : 0
        }
        if (request.childSessionStyle === 'MIXED') {
            signal += caregiver.experience >= 2 ? 2 : 0
        }
    }

    if (request.serviceType === 'DAILY_LIVING_COMPANION') {
        const taskTokens: Record<string, string[]> = {
            'Companionship/conversation': ['companion', 'conversation', 'social'],
            'Meal support': ['meal', 'nutrition', 'food'],
            'Medication reminders': ['medication', 'medicine'],
            'Mobility assistance': ['mobility', 'transfer', 'walking', 'walker'],
            'Appointment escort': ['appointment', 'escort', 'hospital'],
        }

        for (const task of request.dailyTaskPriorities ?? []) {
            if (taskTokens[task] && hasAnyToken(profileText, taskTokens[task])) signal += 4
        }

        if (request.mobilityLevel === 'HIGH') {
            signal += hasAnyToken(profileText, ['mobility', 'transfer', 'walking']) ? 6 : -4
        }

        if (request.interactionStyle === 'CALM') {
            signal += hasAnyToken(profileText, ['dementia', 'elder', 'companion']) ? 2 : 0
        }

        if (request.complexityLevel === 'HIGH') signal += caregiver.experience >= 5 ? 5 : -2
        if (request.complexityLevel === 'MODERATE') signal += caregiver.experience >= 3 ? 3 : 0
        if (request.complexityLevel === 'LOW') signal += 1

        if (request.recipientAgeBand && hasAnyToken(profileText, ['special', 'development', 'behavior', 'routine', 'companion'])) {
            signal += 3
        }
    }

    return Math.max(-10, Math.min(25, signal))
}

function getCulturalFitScore(caregiver: MockCaregiver, request: StoredCareRequest): number {
    let score = 35

    const sameCity = caregiver.city.toLowerCase() === request.locationCity.toLowerCase()
    if (sameCity) score += request.regionalImportance * 0.2

    const languageOverlap = request.mustHaveLanguages.some((requiredLanguage) =>
        caregiver.languages.map((lang) => lang.toLowerCase()).includes(requiredLanguage.toLowerCase()),
    )

    if (languageOverlap) score += request.dialectImportance * 0.2

    score += getFamilyContextBoost(request.familyContext, caregiver, request)

    const culturalPriorityBoost = request.culturalPriority === 'HIGH'
        ? 10
        : request.culturalPriority === 'MEDIUM'
            ? 6
            : 2
    score += culturalPriorityBoost

    return clampScore(score)
}

function getMatchedLanguages(caregiver: MockCaregiver, request: StoredCareRequest): string[] {
    if ((request.mustHaveLanguages?.length ?? 0) === 0) return []
    const spoken = caregiver.languages.map((lang) => lang.toLowerCase())
    return request.mustHaveLanguages.filter((lang) => spoken.includes(lang.toLowerCase()))
}

function getMatchedChildGoals(profileText: string, request: StoredCareRequest): string[] {
    const goalTokens: Record<string, string[]> = {
        'Communication/language': ['speech', 'language', 'communication'],
        'Social interaction': ['social', 'group', 'play'],
        'Routine independence': ['routine', 'daily living', 'self-care', 'self care'],
        'Behavior regulation': ['behavior', 'aba', 'autism'],
        'Sensory integration': ['sensory', 'occupational'],
    }

    return (request.childGoals ?? []).filter((goal) => {
        const tokens = goalTokens[goal]
        return tokens ? hasAnyToken(profileText, tokens) : false
    })
}

function getMatchedChildConditions(profileText: string, request: StoredCareRequest): string[] {
    const conditionTokens: Record<string, string[]> = {
        'Autism spectrum': ['autism', 'aba', 'asd'],
        ADHD: ['adhd', 'attention', 'behavior'],
        'Speech/language delay': ['speech', 'language'],
        'Global developmental delay': ['development', 'developmental'],
        'Learning differences': ['learning', 'education'],
    }

    return (request.childConditions ?? []).filter((condition) => {
        const tokens = conditionTokens[condition]
        return tokens ? hasAnyToken(profileText, tokens) : false
    })
}

function getMatchedDailyTasks(profileText: string, request: StoredCareRequest): string[] {
    const taskTokens: Record<string, string[]> = {
        'Companionship/conversation': ['companion', 'conversation', 'social'],
        'Meal support': ['meal', 'nutrition', 'food'],
        'Medication reminders': ['medication', 'medicine'],
        'Mobility assistance': ['mobility', 'transfer', 'walking', 'walker'],
        'Appointment escort': ['appointment', 'escort', 'hospital'],
    }

    return (request.dailyTaskPriorities ?? []).filter((task) => {
        const tokens = taskTokens[task]
        return tokens ? hasAnyToken(profileText, tokens) : false
    })
}

function buildReasons(caregiver: MockCaregiver, request: StoredCareRequest): string[] {
    const reasons: string[] = []
    const profileText = toSearchableProfile(caregiver)
    const matchedLanguages = getMatchedLanguages(caregiver, request)
    const shiftAligned = request.schedule.includes(caregiver.shift ?? 'DAY') || caregiver.shift === 'BOTH'
    const sameCity = caregiver.city.toLowerCase() === request.locationCity.toLowerCase()
    const inBudget = caregiver.hourlyRate >= request.budgetMin && caregiver.hourlyRate <= request.budgetMax

    if (caregiver.service === request.serviceType) {
        reasons.push(`Primary specialization matches your selected ${request.serviceType === 'SPECIAL_NEEDS_TRAINER' ? 'Child Development Support' : 'Daily Living & Companion Care'} service.`)
    } else if (caregiver.services.includes(request.serviceType)) {
        reasons.push('Cross-trained service coverage supports your selected care type.')
    }

    if (request.serviceType === 'SPECIAL_NEEDS_TRAINER') {
        const goalMatches = getMatchedChildGoals(profileText, request)
        const conditionMatches = getMatchedChildConditions(profileText, request)

        if (goalMatches.length > 0) {
            reasons.push(`Goal alignment: ${goalMatches.slice(0, 2).join(', ')}.`)
        }
        if (conditionMatches.length > 0) {
            reasons.push(`Condition-fit signals for: ${conditionMatches.slice(0, 2).join(', ')}.`)
        }
    } else {
        const taskMatches = getMatchedDailyTasks(profileText, request)
        if (taskMatches.length > 0) {
            reasons.push(`Task alignment: ${taskMatches.slice(0, 2).join(', ')}.`)
        }
    }

    if (matchedLanguages.length > 0) {
        reasons.push(`Language compatibility: ${matchedLanguages.join(', ')}.`)
    }

    if (inBudget) {
        reasons.push(`Budget-fit: ${caregiver.hourlyRate} THB/hr is within your ${request.budgetMin}-${request.budgetMax} THB/hr range.`)
    }
    if (shiftAligned) {
        reasons.push(`Schedule-fit: caregiver shift (${caregiver.shift ?? 'DAY'}) aligns with your request schedule.`)
    }
    if (sameCity) {
        reasons.push(`Local context match in ${caregiver.city}.`)
    }

    reasons.push(`${caregiver.experience} years experience and ${caregiver.rating > 0 ? `${caregiver.rating}★ (${caregiver.reviewCount} reviews)` : 'a new profile ready for first reviews'}.`)

    return reasons.slice(0, 3)
}

function buildPotentialGap(caregiver: MockCaregiver, request: StoredCareRequest): string {
    const profileText = toSearchableProfile(caregiver)
    if (!caregiver.isAvailable) return 'Currently unavailable; family may need to wait for start date confirmation.'
    if (caregiver.hourlyRate > request.budgetMax) return 'Rate is above your stated budget range.'
    if (request.mustHaveLanguages.length > 0 && !request.mustHaveLanguages.some((lang) => caregiver.languages.includes(lang))) {
        return 'Language overlap is limited for your required communication needs.'
    }
    if (request.serviceType === 'DAILY_LIVING_COMPANION' && request.mobilityLevel === 'HIGH' && !hasAnyToken(profileText, ['mobility', 'transfer', 'walking'])) {
        return 'High mobility support was requested, but related caregiving signals are limited in this profile.'
    }
    if (request.serviceType === 'SPECIAL_NEEDS_TRAINER' && (request.childConditions?.length ?? 0) > 0 && !hasAnyToken(profileText, ['autism', 'speech', 'language', 'behavior', 'development'])) {
        return 'Child-condition-specific experience is not clearly evidenced in this profile.'
    }
    return 'No major gap detected based on this request profile.'
}

function buildRecommendation(
    caregiver: MockCaregiver,
    request: StoredCareRequest,
    scores: { requirementFit: number; serviceFit: number; culturalFit: number; finalMatch: number },
): Pick<CaregiverMatchResult, 'aiRecommendationShort' | 'aiRecommendationDetailed'> {
    const weights = getNormalizedWeights(request)
    const matchedLanguages = getMatchedLanguages(caregiver, request)
    const profileText = toSearchableProfile(caregiver)
    const matchedGoals = getMatchedChildGoals(profileText, request)
    const matchedConditions = getMatchedChildConditions(profileText, request)
    const matchedTasks = getMatchedDailyTasks(profileText, request)
    const sameCity = caregiver.city.toLowerCase() === request.locationCity.toLowerCase()
    const shiftAligned = request.schedule.includes(caregiver.shift ?? 'DAY') || caregiver.shift === 'BOTH'
    const inBudget = caregiver.hourlyRate >= request.budgetMin && caregiver.hourlyRate <= request.budgetMax

    const strongestDimension =
        scores.requirementFit >= scores.serviceFit && scores.requirementFit >= scores.culturalFit
            ? 'requirement'
            : scores.serviceFit >= scores.culturalFit
                ? 'service'
                : 'cultural'

    const topEvidence = request.serviceType === 'SPECIAL_NEEDS_TRAINER'
        ? (matchedGoals[0] || matchedConditions[0] || 'child development priorities')
        : (matchedTasks[0] || 'daily companion priorities')

    const short = `${caregiver.firstName} scores ${scores.finalMatch}% with strongest ${strongestDimension}-fit, especially on ${topEvidence}.`

    const serviceEvidence = request.serviceType === 'SPECIAL_NEEDS_TRAINER'
        ? `${matchedGoals.length > 0 ? `Goal matches: ${matchedGoals.slice(0, 2).join(', ')}` : 'Goal mapping is partial'}${matchedConditions.length > 0 ? `; condition signals: ${matchedConditions.slice(0, 2).join(', ')}` : ''}.`
        : `${matchedTasks.length > 0 ? `Task matches: ${matchedTasks.slice(0, 2).join(', ')}` : 'Task mapping is partial for selected priorities'}.`

    const requirementEvidence = [
        inBudget
            ? `Budget aligned (${caregiver.hourlyRate} THB/hr within ${request.budgetMin}-${request.budgetMax}).`
            : `Budget gap (${caregiver.hourlyRate} THB/hr vs ${request.budgetMin}-${request.budgetMax}).`,
        shiftAligned
            ? `Schedule compatible with ${caregiver.shift ?? 'DAY'} shift.`
            : `Schedule needs confirmation (requested ${request.schedule.join('/')}, caregiver ${caregiver.shift ?? 'DAY'}).`,
        matchedLanguages.length > 0
            ? `Language overlap: ${matchedLanguages.join(', ')}.`
            : 'No direct must-have language overlap detected.',
    ].join(' ')

    const culturalEvidence = [
        `Family context: ${request.familyContext.replace('_', ' ').toLowerCase()}.`,
        sameCity ? `Same-city support in ${caregiver.city}.` : `${caregiver.city}-based caregiver for ${request.locationCity} request.`,
        `Caregiver languages: ${caregiver.languages.join(', ')}.`,
    ].join(' ')

    const details = [
        `Your priorities: requirement ${Math.round(weights.requirementWeight * 100)}%, service ${Math.round(weights.serviceWeight * 100)}%, cultural ${Math.round(weights.culturalWeight * 100)}%.`,
        `Requirement fit ${scores.requirementFit}%: ${requirementEvidence}`,
        `Service fit ${scores.serviceFit}%: ${serviceEvidence}`,
        `Cultural fit ${scores.culturalFit}%: ${culturalEvidence}`,
        caregiver.reviewCount > 0
            ? `Confidence signal: ${caregiver.experience} years experience, ${caregiver.rating}★ from ${caregiver.reviewCount} reviews.`
            : `Confidence signal: new profile; verify through a short trial session and scenario-based interview.`,
    ]

    return {
        aiRecommendationShort: short,
        aiRecommendationDetailed: details,
    }
}

export function getMatchesForRequest(request: StoredCareRequest): CaregiverMatchResult[] {
    const caregivers = getCaregiverPool()
    const weights = getNormalizedWeights(request)

    const ranked = caregivers
        .map((caregiver) => {
            const requirementFit = getEligibilityScore(caregiver, request)
            const serviceFit = getServiceFitScore(caregiver, request)
            const culturalFit = getCulturalFitScore(caregiver, request)

            const finalMatch = clampScore(
                requirementFit * weights.requirementWeight
                + serviceFit * weights.serviceWeight
                + culturalFit * weights.culturalWeight,
            )

            const confidence = clampScore(
                (caregiver.verified ? 35 : 20) +
                Math.min(caregiver.reviewCount, 100) * 0.2 +
                Math.min(caregiver.experience, 10) * 3,
            )

            const badges = [
                finalMatch >= 85 ? 'High Match' : 'Good Match',
                request.familyContext === 'THAI_LOCAL' ? 'Cultural Harmony' : 'Cultural Anchor',
                caregiver.verified ? 'Verified Profile' : 'New Profile',
            ]

            const recommendation = buildRecommendation(caregiver, request, {
                requirementFit,
                serviceFit,
                culturalFit,
                finalMatch,
            })

            return {
                caregiverId: caregiver.id,
                caregiverName: `${caregiver.firstName} ${caregiver.lastName}`,
                caregiverAvatar: caregiver.avatar,
                caregiverHourlyRate: caregiver.hourlyRate,
                serviceType: request.serviceType,
                finalMatch,
                requirementFit,
                serviceFit,
                culturalFit,
                confidence,
                badges,
                reasons: buildReasons(caregiver, request),
                potentialGap: buildPotentialGap(caregiver, request),
                aiRecommendationShort: recommendation.aiRecommendationShort,
                aiRecommendationDetailed: recommendation.aiRecommendationDetailed,
            }
        })
        .sort((a, b) => b.finalMatch - a.finalMatch)

    return ranked
}
