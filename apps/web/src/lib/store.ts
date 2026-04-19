// In-memory array database — perfect for hackathon MVP
// Data persists for the lifetime of the Next.js server process

// ─── Enums (re-exported from shared types) ────────────────────────────────────
export {
    UserRole, CaregiverType, BookingStatus, ApplicationStatus,
    ThaiDialect, SecondaryLanguage, CommunicationStyle,
    SpiritualSkill, CulinarySpecialty,
    EducationLevel, ClinicalSkill, MobilitySupport, ConditionExperience,
    StorytellingLevel, MusicalHeritage, VocabBreadth,
    CalendarAwareness, CulturalActivity, ArtifactUsage,
    CommunityInvolvement, TraditionalAttire, RelationshipLevel,
} from '@/lib/types'

import {
    UserRole, CaregiverType, BookingStatus, ApplicationStatus,
    ThaiDialect, SecondaryLanguage, CommunicationStyle,
    SpiritualSkill, CulinarySpecialty,
    EducationLevel, ClinicalSkill, MobilitySupport, ConditionExperience,
    StorytellingLevel, MusicalHeritage, VocabBreadth,
    CalendarAwareness, CulturalActivity, ArtifactUsage,
    CommunityInvolvement, TraditionalAttire, RelationshipLevel,
} from '@/lib/types'

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface StoredUser {
    id: number
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: UserRole
    points: number   // loyalty points — drives Bronze/Silver/Gold tier
    createdAt: string

    // Caregiver-specific fields
    country?: string
    caregiverType?: CaregiverType

    // Thai caregiver — Cultural (65%)
    nativeDialect?: ThaiDialect
    secondaryLanguages?: SecondaryLanguage[]
    hometown?: string
    communicationStyle?: CommunicationStyle
    spiritualSkills?: SpiritualSkill[]
    culinarySpecialties?: CulinarySpecialty[]

    // Thai caregiver — Medical (35%)
    education?: EducationLevel
    clinicalSkills?: ClinicalSkill[]
    mobilitySupport?: MobilitySupport
    conditionExperience?: ConditionExperience[]
    yearsExperience?: number

    // Foreign caregiver — Language (40%)
    motherTongue?: string
    dialect?: string
    storytellingLevel?: StorytellingLevel
    musicalHeritage?: MusicalHeritage[]
    vocabBreadth?: VocabBreadth

    // Foreign caregiver — Cultural Practice (30%)
    ritualMastery?: string
    ethnicDishes?: string
    calendarAwareness?: CalendarAwareness[]

    // Foreign caregiver — Child Facilitation (20%)
    culturalActivities?: CulturalActivity[]
    explanationAbility?: string
    usesArtifacts?: ArtifactUsage

    // Foreign caregiver — Identity Affirmation (10%)
    communityInvolvement?: CommunityInvolvement
    pridStatement?: string
    traditionalAttire?: TraditionalAttire
}

export interface StoredBooking {
    id: number
    customerId: number
    customerName: string
    caregiverId: number
    caregiverName: string
    caregiverAvatar: string
    serviceType: string
    serviceName: string
    date: string
    time: string
    hours: number
    totalPrice: number
    platformFee: number
    isEmergency: boolean
    notes: string
    status: BookingStatus
    createdAt: string
}

export interface StoredApplication {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    services: string[]
    experience: number
    bio: string
    certifications: string
    hourlyRate: number
    city: string
    status: ApplicationStatus
    createdAt: string
}

export interface StoredCaregiverProfile {
    userId: number          // same as the user's ID
    firstName: string
    lastName: string
    email: string
    avatar?: string
    services: string[]
    primaryService: string  // services[0]
    bio: string
    experience: number
    hourlyRate: number
    city: string
    certifications: string  // raw comma-separated string from form
    languages?: string[]
    specialties?: string[]
    shift?: 'DAY' | 'NIGHT' | 'BOTH'
    rating?: number
    reviewCount?: number
    isAvailable: boolean
    createdAt: string
}

export type SpecialNeedsServiceType =
    | 'SPECIAL_NEEDS_TRAINER'
    | 'DAILY_LIVING_COMPANION'

export type FamilyContextType = 'THAI_LOCAL' | 'MIGRANT_HERITAGE' | 'MIXED'

export type CareRequestStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'FULFILLED' | 'CANCELLED'

export interface StoredCareRequest {
    id: number
    customerId: number
    serviceType: SpecialNeedsServiceType
    status: CareRequestStatus
    title: string
    startDate: string
    locationCity: string
    budgetMin: number
    budgetMax: number
    schedule: Array<'DAY' | 'NIGHT' | 'BOTH'>
    mustHaveLanguages: string[]
    mustHaveSkills: string[]
    niceToHaveSkills: string[]
    familyContext: FamilyContextType
    dialectImportance: number
    regionalImportance: number
    culturalPriority: 'LOW' | 'MEDIUM' | 'HIGH'
    culturalRequirements: string[]
    matchWeightRequirement: number
    matchWeightService: number
    matchWeightCultural: number
    requirementsText?: string
    familyStoryText?: string
    childAgeBand?: string
    childGoals?: string[]
    childConditions?: string[]
    childSessionStyle?: 'STRUCTURED' | 'PLAY_BASED' | 'MIXED'
    recipientAgeBand?: string
    mobilityLevel?: 'LOW' | 'MODERATE' | 'HIGH'
    dailyTaskPriorities?: string[]
    complexityLevel?: 'LOW' | 'MODERATE' | 'HIGH'
    interactionStyle?: 'CALM' | 'ENGAGING' | 'FORMAL'
    createdAt: string
    updatedAt: string
}

export const TIER_CONFIG = [
    { name: 'Bronze', icon: '🥉', min: 0, max: 499, color: '#CD7F32', fee: '฿99', bg: '#FFF8F2' },
    { name: 'Silver', icon: '🥈', min: 500, max: 1999, color: '#6C63FF', fee: '฿79', bg: '#F3F2FF' },
    { name: 'Gold', icon: '🥇', min: 2000, max: Infinity, color: '#FF8C00', fee: '฿59', bg: '#FFF8F0' },
] as const

export type TierName = 'Bronze' | 'Silver' | 'Gold'

export function getTier(points: number): typeof TIER_CONFIG[number] {
    return [...TIER_CONFIG].reverse().find(t => points >= t.min) ?? TIER_CONFIG[0]
}

interface StoreData {
    users: StoredUser[]
    bookings: StoredBooking[]
    applications: StoredApplication[]
    caregiverProfiles: StoredCaregiverProfile[]
    careRequests: StoredCareRequest[]
    _nextUserId: number
    _nextBookingId: number
    _nextAppId: number
    _nextRequestId: number
}

// Seeded demo data
const SEED_USERS: StoredUser[] = [
    {
        id: 1,
        email: 'siriporn@example.com',
        password: 'demo1234',
        firstName: 'Siriporn',
        lastName: 'Wattana',
        phone: '0812345678',
        role: UserRole.Customer,
        points: 380,
        createdAt: new Date('2026-01-01').toISOString(),
    },
    {
        id: 2,
        email: 'nida@example.com',
        password: 'demo1234',
        firstName: 'Nida',
        lastName: 'Somchai',
        phone: '0823456789',
        role: UserRole.Caregiver,
        points: 1250,
        createdAt: new Date('2026-01-02').toISOString(),
    },
    {
        id: 3,
        email: 'admin@carethia.com',
        password: 'admin1234',
        firstName: 'Admin',
        lastName: 'Carethia',
        phone: '0800000000',
        role: UserRole.Admin,
        points: 2500,
        createdAt: new Date('2026-01-01').toISOString(),
    },
    // ── Demo: Thai Caregiver (Sook-Jai Score) ─────────────────────────────────
    {
        id: 104,
        email: 'nipa.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Nipa',
        lastName: 'Saengthong',
        phone: '0891234567',
        role: UserRole.Caregiver,
        points: 920,
        createdAt: new Date('2026-01-10').toISOString(),
        country: 'Thailand',
        caregiverType: CaregiverType.Thai,
        // Cultural & Dialect Profile (65%)
        nativeDialect: ThaiDialect.Central,
        secondaryLanguages: [SecondaryLanguage.English, SecondaryLanguage.Japanese],
        hometown: 'Bangkok',
        communicationStyle: CommunicationStyle.JaJaa,
        spiritualSkills: [SpiritualSkill.TakBat, SpiritualSkill.Chanting],
        culinarySpecialties: [CulinarySpecialty.SoftFood, CulinarySpecialty.LowSodium],
        // Medical & Professional Skill (35%)
        education: EducationLevel.PracticalNurse,
        clinicalSkills: [ClinicalSkill.Vitals, ClinicalSkill.Medication, ClinicalSkill.Wound],
        mobilitySupport: MobilitySupport.AssistedWalk,
        conditionExperience: [ConditionExperience.Dementia, ConditionExperience.Stroke],
        yearsExperience: 8,
    },
    // ── Demo: Foreigner Caregiver (CAS Score) ─────────────────────────────────
    {
        id: 105,
        email: 'aye.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Aye',
        lastName: 'Myat Thu',
        phone: '0851239876',
        role: UserRole.Caregiver,
        points: 1540,
        createdAt: new Date('2026-01-15').toISOString(),
        country: 'Myanmar',
        caregiverType: CaregiverType.Foreigner,
        // Native Language Fluency (40%)
        motherTongue: 'Burmese (Bamar)',
        dialect: 'Yangon dialect',
        storytellingLevel: StorytellingLevel.Advanced,
        musicalHeritage: [MusicalHeritage.Lullabies, MusicalHeritage.FolkSongs],
        vocabBreadth: VocabBreadth.Advanced,
        // Cultural Practice Knowledge (30%)
        ritualMastery: 'Knowledge of Thingyan water festival; can set up merit-making offerings for Thadingyut.',
        ethnicDishes: 'Mohinga, Laphet Thoke, Ohn No Khao Swè, Htamin Jin, Mont Lin Ma Yar',
        calendarAwareness: [CalendarAwareness.LunarNewYear, CalendarAwareness.Harvest, CalendarAwareness.Religious],
        // Child Cultural Facilitation (20%)
        culturalActivities: [CulturalActivity.Games, CulturalActivity.Dance],
        explanationAbility: 'I would compare Thingyan to a big birthday party for the whole country — we splash water to wash away bad luck and welcome a fresh start.',
        usesArtifacts: ArtifactUsage.Yes,
        // Cultural Identity Affirmation (10%)
        communityInvolvement: CommunityInvolvement.Active,
        pridStatement: 'I am most proud of our tradition of storytelling through dance — every movement in the Yama Zatdaw tells a moral lesson that children carry for life.',
        traditionalAttire: TraditionalAttire.Own,
    },
    // ── Demo: Thai Caregiver (Child development focus) ───────────────────────
    {
        id: 106,
        email: 'malee.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Malee',
        lastName: 'Thanakit',
        phone: '0841122334',
        role: UserRole.Caregiver,
        points: 810,
        createdAt: new Date('2026-01-18').toISOString(),
        country: 'Thailand',
        caregiverType: CaregiverType.Thai,
        nativeDialect: ThaiDialect.Northern,
        secondaryLanguages: [SecondaryLanguage.English],
        hometown: 'Chiang Mai',
        communicationStyle: CommunicationStyle.KhuaySanuk,
        spiritualSkills: [SpiritualSkill.Holidays],
        culinarySpecialties: [CulinarySpecialty.SoftFood, CulinarySpecialty.NamPrik],
        education: EducationLevel.NursingAssistant,
        clinicalSkills: [ClinicalSkill.Vitals, ClinicalSkill.Medication],
        mobilitySupport: MobilitySupport.AssistedWalk,
        conditionExperience: [ConditionExperience.Stroke, ConditionExperience.Diabetes],
        yearsExperience: 6,
    },
    // ── Demo: Foreigner Caregiver (Bilingual family focus) ───────────────────
    {
        id: 107,
        email: 'maria.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Maria',
        lastName: 'Santos',
        phone: '0867788990',
        role: UserRole.Caregiver,
        points: 990,
        createdAt: new Date('2026-01-20').toISOString(),
        country: 'Philippines',
        caregiverType: CaregiverType.Foreigner,
        motherTongue: 'Tagalog',
        dialect: 'Cebuano',
        storytellingLevel: StorytellingLevel.Advanced,
        musicalHeritage: [MusicalHeritage.Lullabies, MusicalHeritage.Nursery],
        vocabBreadth: VocabBreadth.Advanced,
        ritualMastery: 'Knowledge of Simbang Gabi, Flores de Mayo, and family prayer traditions.',
        ethnicDishes: 'Arroz caldo, adobo, sinigang, champorado',
        calendarAwareness: [CalendarAwareness.Religious, CalendarAwareness.OtherEthnic],
        culturalActivities: [CulturalActivity.Games, CulturalActivity.Crafts],
        explanationAbility: 'I use songs and story cards to connect culture to daily routines for young children.',
        usesArtifacts: ArtifactUsage.Yes,
        communityInvolvement: CommunityInvolvement.Occasional,
        pridStatement: 'I am proud of our caring spirit and the way we build family through food and language.',
        traditionalAttire: TraditionalAttire.Willing,
    },
    // ── Demo: Thai Caregiver (High-acuity elder support) ─────────────────────
    {
        id: 108,
        email: 'kanok.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Kanok',
        lastName: 'Rattanakul',
        phone: '0835566778',
        role: UserRole.Caregiver,
        points: 1340,
        createdAt: new Date('2026-01-23').toISOString(),
        country: 'Thailand',
        caregiverType: CaregiverType.Thai,
        nativeDialect: ThaiDialect.Isan,
        secondaryLanguages: [SecondaryLanguage.English, SecondaryLanguage.Burmese],
        hometown: 'Khon Kaen',
        communicationStyle: CommunicationStyle.SanguanTa,
        spiritualSkills: [SpiritualSkill.TakBat, SpiritualSkill.Chanting, SpiritualSkill.Holidays],
        culinarySpecialties: [CulinarySpecialty.LowSodium, CulinarySpecialty.SoftFood],
        education: EducationLevel.BachelorNursing,
        clinicalSkills: [ClinicalSkill.Vitals, ClinicalSkill.Medication, ClinicalSkill.Oxygen, ClinicalSkill.Wound],
        mobilitySupport: MobilitySupport.HeavyLift,
        conditionExperience: [ConditionExperience.Dementia, ConditionExperience.Stroke, ConditionExperience.Palliative],
        yearsExperience: 12,
    },
    // ── Demo: Thai Caregiver (Autism/ADHD child specialist) ─────────────────
    {
        id: 109,
        email: 'sirilak.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Sirilak',
        lastName: 'Jindarat',
        phone: '0827788112',
        role: UserRole.Caregiver,
        points: 1180,
        createdAt: new Date('2026-01-25').toISOString(),
        country: 'Thailand',
        caregiverType: CaregiverType.Thai,
        nativeDialect: ThaiDialect.Central,
        secondaryLanguages: [SecondaryLanguage.English],
        hometown: 'Bangkok',
        communicationStyle: CommunicationStyle.KhuaySanuk,
        spiritualSkills: [SpiritualSkill.Holidays],
        culinarySpecialties: [CulinarySpecialty.SoftFood],
        education: EducationLevel.BachelorNursing,
        clinicalSkills: [ClinicalSkill.Vitals, ClinicalSkill.Medication],
        mobilitySupport: MobilitySupport.AssistedWalk,
        conditionExperience: [ConditionExperience.Dementia],
        yearsExperience: 9,
    },
    // ── Demo: Foreigner Caregiver (Mandarin bilingual support) ───────────────
    {
        id: 110,
        email: 'lin.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Lin',
        lastName: 'Mei',
        phone: '0816677331',
        role: UserRole.Caregiver,
        points: 860,
        createdAt: new Date('2026-01-27').toISOString(),
        country: 'China',
        caregiverType: CaregiverType.Foreigner,
        motherTongue: 'Mandarin',
        dialect: 'Cantonese',
        storytellingLevel: StorytellingLevel.Expert,
        musicalHeritage: [MusicalHeritage.Nursery, MusicalHeritage.FolkSongs],
        vocabBreadth: VocabBreadth.Advanced,
        ritualMastery: 'Strong Lunar New Year and Mid-Autumn festival teaching for children.',
        ethnicDishes: 'Congee, steamed fish, dumplings, red bean soup',
        calendarAwareness: [CalendarAwareness.LunarNewYear, CalendarAwareness.OtherEthnic],
        culturalActivities: [CulturalActivity.Crafts, CulturalActivity.Instrument],
        explanationAbility: 'Uses visual cards and stories to explain traditions in child-friendly ways.',
        usesArtifacts: ArtifactUsage.Yes,
        communityInvolvement: CommunityInvolvement.Active,
        pridStatement: 'Language and traditions help children feel rooted and confident.',
        traditionalAttire: TraditionalAttire.Own,
    },
    // ── Demo: Thai Caregiver (Night shift elder companion) ───────────────────
    {
        id: 111,
        email: 'orawan.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Orawan',
        lastName: 'Saelee',
        phone: '0863344556',
        role: UserRole.Caregiver,
        points: 940,
        createdAt: new Date('2026-01-28').toISOString(),
        country: 'Thailand',
        caregiverType: CaregiverType.Thai,
        nativeDialect: ThaiDialect.Southern,
        secondaryLanguages: [SecondaryLanguage.English],
        hometown: 'Phuket',
        communicationStyle: CommunicationStyle.SanguanTa,
        spiritualSkills: [SpiritualSkill.TakBat, SpiritualSkill.Chanting],
        culinarySpecialties: [CulinarySpecialty.LowSodium, CulinarySpecialty.SoftFood],
        education: EducationLevel.PracticalNurse,
        clinicalSkills: [ClinicalSkill.Vitals, ClinicalSkill.Medication, ClinicalSkill.Oxygen],
        mobilitySupport: MobilitySupport.Bedridden,
        conditionExperience: [ConditionExperience.Dementia, ConditionExperience.Palliative],
        yearsExperience: 11,
    },
    // ── Demo: Thai Caregiver (Stroke rehab & mobility) ───────────────────────
    {
        id: 112,
        email: 'tharinee.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Tharinee',
        lastName: 'Kongkaew',
        phone: '0895511229',
        role: UserRole.Caregiver,
        points: 1020,
        createdAt: new Date('2026-01-29').toISOString(),
        country: 'Thailand',
        caregiverType: CaregiverType.Thai,
        nativeDialect: ThaiDialect.Isan,
        secondaryLanguages: [SecondaryLanguage.English],
        hometown: 'Ubon Ratchathani',
        communicationStyle: CommunicationStyle.DuedDun,
        spiritualSkills: [SpiritualSkill.Holidays],
        culinarySpecialties: [CulinarySpecialty.LowSodium],
        education: EducationLevel.BachelorNursing,
        clinicalSkills: [ClinicalSkill.Vitals, ClinicalSkill.Wound, ClinicalSkill.Medication],
        mobilitySupport: MobilitySupport.HeavyLift,
        conditionExperience: [ConditionExperience.Stroke, ConditionExperience.Diabetes],
        yearsExperience: 10,
    },
    // ── Demo: Foreigner Caregiver (Play-based language growth) ───────────────
    {
        id: 113,
        email: 'camila.demo@carethia.com',
        password: 'demo1234',
        firstName: 'Camila',
        lastName: 'Reyes',
        phone: '0839900112',
        role: UserRole.Caregiver,
        points: 780,
        createdAt: new Date('2026-01-30').toISOString(),
        country: 'Philippines',
        caregiverType: CaregiverType.Foreigner,
        motherTongue: 'Filipino',
        dialect: 'Ilocano',
        storytellingLevel: StorytellingLevel.Advanced,
        musicalHeritage: [MusicalHeritage.Lullabies, MusicalHeritage.Nursery],
        vocabBreadth: VocabBreadth.Intermediate,
        ritualMastery: 'Family-centered holiday and song traditions for young children.',
        ethnicDishes: 'Tinola, arroz caldo, pancit, bibingka',
        calendarAwareness: [CalendarAwareness.Religious, CalendarAwareness.OtherEthnic],
        culturalActivities: [CulturalActivity.Games, CulturalActivity.Dance],
        explanationAbility: 'Uses play, songs, and simple examples to improve language confidence.',
        usesArtifacts: ArtifactUsage.No,
        communityInvolvement: CommunityInvolvement.Occasional,
        pridStatement: 'Children should feel proud of every language they speak.',
        traditionalAttire: TraditionalAttire.Willing,
    },
]

const SEED_CAREGIVER_PROFILES: StoredCaregiverProfile[] = [
    {
        userId: 104,
        firstName: 'Nipa',
        lastName: 'Saengthong',
        email: 'nipa.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=51',
        services: ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION'],
        primaryService: 'SPECIAL_NEEDS_TRAINER',
        bio: 'Thai caregiver focused on special-needs routines, calm communication, and family coordination.',
        experience: 8,
        hourlyRate: 320,
        city: 'Bangkok',
        certifications: 'Practical Nurse (PN), vitals, medication, wound',
        languages: ['Thai', 'English', 'Japanese'],
        specialties: ['dementia', 'stroke', 'soft_food', 'low_sodium'],
        shift: 'DAY',
        rating: 4.8,
        reviewCount: 64,
        isAvailable: true,
        createdAt: new Date('2026-01-10').toISOString(),
    },
    {
        userId: 105,
        firstName: 'Aye',
        lastName: 'Myat Thu',
        email: 'aye.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=52',
        services: ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION'],
        primaryService: 'DAILY_LIVING_COMPANION',
        bio: 'Cultural-bridge caregiver for migrant families; uses songs and traditions to support child confidence.',
        experience: 7,
        hourlyRate: 300,
        city: 'Bangkok',
        certifications: 'Advanced storytelling, cultural facilitation',
        languages: ['Burmese (Bamar)', 'Yangon dialect', 'Thai'],
        specialties: ['lullabies', 'folk_songs', 'games', 'dance'],
        shift: 'BOTH',
        rating: 4.7,
        reviewCount: 52,
        isAvailable: true,
        createdAt: new Date('2026-01-15').toISOString(),
    },
    {
        userId: 106,
        firstName: 'Malee',
        lastName: 'Thanakit',
        email: 'malee.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=53',
        services: ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION'],
        primaryService: 'DAILY_LIVING_COMPANION',
        bio: 'Warm caregiver from Chiang Mai with child-focused routines and stroke/diabetes support experience.',
        experience: 6,
        hourlyRate: 280,
        city: 'Chiang Mai',
        certifications: 'Nursing Assistant (NA), vitals, medication',
        languages: ['Thai', 'English'],
        specialties: ['stroke', 'diabetes', 'soft_food', 'nam_prik'],
        shift: 'DAY',
        rating: 4.6,
        reviewCount: 48,
        isAvailable: true,
        createdAt: new Date('2026-01-18').toISOString(),
    },
    {
        userId: 107,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=54',
        services: ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION'],
        primaryService: 'DAILY_LIVING_COMPANION',
        bio: 'Bilingual caregiver helping multicultural households with language continuity and daily living support.',
        experience: 5,
        hourlyRate: 290,
        city: 'Bangkok',
        certifications: 'Advanced storytelling, child cultural activities',
        languages: ['Tagalog', 'Cebuano', 'Thai'],
        specialties: ['lullabies', 'nursery', 'games', 'crafts'],
        shift: 'BOTH',
        rating: 4.7,
        reviewCount: 43,
        isAvailable: true,
        createdAt: new Date('2026-01-20').toISOString(),
    },
    {
        userId: 108,
        firstName: 'Kanok',
        lastName: 'Rattanakul',
        email: 'kanok.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=55',
        services: ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION'],
        primaryService: 'SPECIAL_NEEDS_TRAINER',
        bio: 'Senior Thai caregiver for higher-acuity care plans, transfer support, and palliative companionship.',
        experience: 12,
        hourlyRate: 360,
        city: 'Khon Kaen',
        certifications: 'Bachelor of Nursing (RN), oxygen, wound care, medication',
        languages: ['Thai', 'English', 'Burmese'],
        specialties: ['dementia', 'stroke', 'palliative', 'low_sodium'],
        shift: 'NIGHT',
        rating: 4.9,
        reviewCount: 77,
        isAvailable: true,
        createdAt: new Date('2026-01-23').toISOString(),
    },
    {
        userId: 109,
        firstName: 'Sirilak',
        lastName: 'Jindarat',
        email: 'sirilak.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=56',
        services: ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION'],
        primaryService: 'SPECIAL_NEEDS_TRAINER',
        bio: 'Child-focused specialist for autism and ADHD routines with structured play and behavior support.',
        experience: 9,
        hourlyRate: 340,
        city: 'Bangkok',
        certifications: 'RN, behavioral support, family coaching',
        languages: ['Thai', 'English'],
        specialties: ['autism support', 'adhd coaching', 'structured play'],
        shift: 'DAY',
        rating: 4.9,
        reviewCount: 61,
        isAvailable: true,
        createdAt: new Date('2026-01-25').toISOString(),
    },
    {
        userId: 110,
        firstName: 'Lin',
        lastName: 'Mei',
        email: 'lin.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=57',
        services: ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION'],
        primaryService: 'DAILY_LIVING_COMPANION',
        bio: 'Mandarin bilingual caregiver for multicultural homes and language continuity support.',
        experience: 6,
        hourlyRate: 310,
        city: 'Bangkok',
        certifications: 'Child language facilitation, cultural curriculum',
        languages: ['Mandarin', 'Cantonese', 'Thai'],
        specialties: ['bilingual care', 'storytelling', 'festival education'],
        shift: 'BOTH',
        rating: 4.6,
        reviewCount: 39,
        isAvailable: true,
        createdAt: new Date('2026-01-27').toISOString(),
    },
    {
        userId: 111,
        firstName: 'Orawan',
        lastName: 'Saelee',
        email: 'orawan.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=58',
        services: ['DAILY_LIVING_COMPANION', 'SPECIAL_NEEDS_TRAINER'],
        primaryService: 'DAILY_LIVING_COMPANION',
        bio: 'Night caregiver for elder supervision, safe transfer routines, and overnight reassurance.',
        experience: 11,
        hourlyRate: 350,
        city: 'Phuket',
        certifications: 'PN, oxygen support, palliative companionship',
        languages: ['Thai', 'English'],
        specialties: ['night watch', 'bedridden care', 'dementia routine'],
        shift: 'NIGHT',
        rating: 4.8,
        reviewCount: 72,
        isAvailable: true,
        createdAt: new Date('2026-01-28').toISOString(),
    },
    {
        userId: 112,
        firstName: 'Tharinee',
        lastName: 'Kongkaew',
        email: 'tharinee.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=59',
        services: ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION'],
        primaryService: 'SPECIAL_NEEDS_TRAINER',
        bio: 'Stroke-rehab and mobility caregiver emphasizing safe transfer, exercise prompts, and consistency.',
        experience: 10,
        hourlyRate: 330,
        city: 'Ubon Ratchathani',
        certifications: 'RN, mobility support, wound care',
        languages: ['Thai', 'English'],
        specialties: ['stroke recovery', 'mobility assistance', 'diabetes support'],
        shift: 'DAY',
        rating: 4.7,
        reviewCount: 55,
        isAvailable: true,
        createdAt: new Date('2026-01-29').toISOString(),
    },
    {
        userId: 113,
        firstName: 'Camila',
        lastName: 'Reyes',
        email: 'camila.demo@carethia.com',
        avatar: 'https://i.pravatar.cc/150?img=60',
        services: ['DAILY_LIVING_COMPANION', 'SPECIAL_NEEDS_TRAINER'],
        primaryService: 'DAILY_LIVING_COMPANION',
        bio: 'Play-based companion for language growth, confidence building, and positive routines.',
        experience: 5,
        hourlyRate: 285,
        city: 'Chiang Mai',
        certifications: 'Child activity facilitation, bilingual support',
        languages: ['Filipino', 'Ilocano', 'Thai'],
        specialties: ['play therapy style', 'language routines', 'social confidence'],
        shift: 'BOTH',
        rating: 4.5,
        reviewCount: 34,
        isAvailable: true,
        createdAt: new Date('2026-01-30').toISOString(),
    },
]

const SEED_BOOKINGS: StoredBooking[] = [
    // ── Bookings for Customer Siriporn (customerId=1) ──────────────────────────
    {
        id: 1,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 10,
        caregiverName: 'Anong Pimjai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=47',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-10',
        time: '09:00 AM',
        hours: 3,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: BookingStatus.Confirmed,
        createdAt: new Date('2026-03-01').toISOString(),
    },
    {
        id: 2,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 3,
        caregiverName: 'Pornpan Wattana',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=44',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-15',
        time: '02:00 PM',
        hours: 4,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: 'Please bring your own cleaning supplies.',
        status: BookingStatus.Pending,
        createdAt: new Date('2026-03-02').toISOString(),
    },
    {
        id: 3,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 2,
        caregiverName: 'Malee Thanakit',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=45',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-02-20',
        time: '08:00 AM',
        hours: 4,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: BookingStatus.Completed,
        createdAt: new Date('2026-02-15').toISOString(),
    },
    {
        id: 4,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 4,
        caregiverName: 'Aisha Rahman',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=48',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-02-10',
        time: '10:00 AM',
        hours: 2,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: 'My son has ADHD. Please be patient.',
        status: BookingStatus.Completed,
        createdAt: new Date('2026-02-05').toISOString(),
    },
    // ── Bookings FOR Caregiver Nida (caregiverId=2) ────────────────────────────
    {
        id: 5,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-12',
        time: '09:00 AM',
        hours: 4,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: 'Two kids, ages 3 and 5. Please bring craft supplies.',
        status: BookingStatus.Pending,
        createdAt: new Date('2026-03-06').toISOString(),
    },
    {
        id: 6,
        customerId: 20,
        customerName: 'Malee Jaidee',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-14',
        time: '02:00 PM',
        hours: 3,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: 'Infant care — baby is 8 months.',
        status: BookingStatus.Pending,
        createdAt: new Date('2026-03-06').toISOString(),
    },
    {
        id: 7,
        customerId: 21,
        customerName: 'Pranee Sukjai',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-09',
        time: '10:00 AM',
        hours: 5,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: BookingStatus.Confirmed,
        createdAt: new Date('2026-03-04').toISOString(),
    },
    {
        id: 8,
        customerId: 22,
        customerName: 'Wilai Boonsong',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-08',
        time: '08:00 AM',
        hours: 6,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: true,
        notes: 'Emergency booking — husband hospitalized.',
        status: BookingStatus.Confirmed,
        createdAt: new Date('2026-03-07').toISOString(),
    },
    {
        id: 9,
        customerId: 23,
        customerName: 'Suparat Thong',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-02-25',
        time: '09:00 AM',
        hours: 4,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: BookingStatus.Completed,
        createdAt: new Date('2026-02-20').toISOString(),
    },
    {
        id: 10,
        customerId: 24,
        customerName: 'Nopparat Klahan',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-02-18',
        time: '01:00 PM',
        hours: 3,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: BookingStatus.Completed,
        createdAt: new Date('2026-02-14').toISOString(),
    },
]

const SEED_CARE_REQUESTS: StoredCareRequest[] = [
    {
        id: 1,
        customerId: 1,
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        status: 'ACTIVE',
        title: 'Speech & social growth support for child',
        startDate: '2026-04-25',
        locationCity: 'Chiang Mai',
        budgetMin: 250,
        budgetMax: 450,
        schedule: ['DAY'],
        mustHaveLanguages: ['Thai', 'English'],
        mustHaveSkills: ['Special-needs training', 'Progress reporting'],
        niceToHaveSkills: ['Speech support', 'Play therapy'],
        familyContext: 'THAI_LOCAL',
        dialectImportance: 70,
        regionalImportance: 60,
        culturalPriority: 'HIGH',
        culturalRequirements: ['Warm communication', 'Understands Thai family etiquette'],
        matchWeightRequirement: 40,
        matchWeightService: 35,
        matchWeightCultural: 25,
        childAgeBand: '6-9',
        childGoals: ['Communication/language', 'Social interaction', 'Routine independence'],
        childConditions: ['Speech/language delay', 'ADHD'],
        childSessionStyle: 'MIXED',
        createdAt: new Date('2026-04-10').toISOString(),
        updatedAt: new Date('2026-04-15').toISOString(),
    },
    {
        id: 2,
        customerId: 1,
        serviceType: 'DAILY_LIVING_COMPANION',
        status: 'DRAFT',
        title: 'Weekend companion and daily living help',
        startDate: '2026-05-01',
        locationCity: 'Chiang Mai',
        budgetMin: 220,
        budgetMax: 420,
        schedule: ['DAY', 'NIGHT'],
        mustHaveLanguages: ['Thai'],
        mustHaveSkills: ['Medication reminders'],
        niceToHaveSkills: ['Light meal prep', 'Mobility assistance'],
        familyContext: 'MIXED',
        dialectImportance: 40,
        regionalImportance: 35,
        culturalPriority: 'MEDIUM',
        culturalRequirements: ['Calm, respectful tone'],
        matchWeightRequirement: 40,
        matchWeightService: 35,
        matchWeightCultural: 25,
        recipientAgeBand: '18-24',
        mobilityLevel: 'MODERATE',
        dailyTaskPriorities: ['Companionship/conversation', 'Meal support', 'Appointment escort'],
        complexityLevel: 'MODERATE',
        interactionStyle: 'CALM',
        createdAt: new Date('2026-04-12').toISOString(),
        updatedAt: new Date('2026-04-12').toISOString(),
    },
]

function createInitialStore(): StoreData {
    return {
        users: [...SEED_USERS],
        bookings: [...SEED_BOOKINGS],
        applications: [],
        caregiverProfiles: [...SEED_CAREGIVER_PROFILES],
        careRequests: [...SEED_CARE_REQUESTS],
        _nextUserId: 200,
        _nextBookingId: 100,
        _nextAppId: 100,
        _nextRequestId: 100,
    }
}

declare global {
    // eslint-disable-next-line no-var
    var __carethia_store: StoreData | undefined
}

function getStore(): StoreData {
    if (!global.__carethia_store) {
        global.__carethia_store = createInitialStore()
    }
    return global.__carethia_store
}

// ─── User helpers ─────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): StoredUser | undefined {
    return getStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: number): StoredUser | undefined {
    return getStore().users.find((u) => u.id === id)
}

export function createUser(data: Omit<StoredUser, 'id' | 'createdAt' | 'points'> & { points?: number }): StoredUser {
    const store = getStore()
    const user: StoredUser = { ...data, points: data.points ?? 0, id: store._nextUserId++, createdAt: new Date().toISOString() }
    store.users.push(user)
    return user
}

/** Award points to a user. Returns new total. */
export function addPoints(userId: number, pts: number): number {
    const user = getStore().users.find(u => u.id === userId)
    if (!user) return 0
    user.points = (user.points ?? 0) + pts
    return user.points
}

export function safeUser(user: StoredUser) {
    const { password: _pw, ...safe } = user
    return safe
}

// ─── Booking helpers ───────────────────────────────────────────────────────────

export function createBooking(data: Omit<StoredBooking, 'id' | 'createdAt'>): StoredBooking {
    const store = getStore()
    const booking: StoredBooking = { ...data, id: store._nextBookingId++, createdAt: new Date().toISOString() }
    store.bookings.push(booking)
    return booking
}

export function getBookingsByCustomer(customerId: number): StoredBooking[] {
    return getStore()
        .bookings.filter((b) => b.customerId === customerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getBookingsByCaregiver(caregiverId: number): StoredBooking[] {
    return getStore()
        .bookings.filter((b) => b.caregiverId === caregiverId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function updateBookingStatus(
    bookingId: number,
    status: StoredBooking['status'],
): StoredBooking | null {
    const store = getStore()
    const booking = store.bookings.find((b) => b.id === bookingId)
    if (!booking) return null
    booking.status = status
    // Award loyalty points on completion
    if (status === BookingStatus.Completed) {
        addPoints(booking.customerId, 50)   // customer earns 50 pts per completed booking
        addPoints(booking.caregiverId, 100) // caregiver earns 100 pts per completed session
    }
    return booking
}

export function getAllBookings(): StoredBooking[] {
    return getStore().bookings
}

// ─── Application helpers ───────────────────────────────────────────────────────

export function createApplication(data: Omit<StoredApplication, 'id' | 'createdAt'>): StoredApplication {
    const store = getStore()
    const app: StoredApplication = { ...data, id: store._nextAppId++, createdAt: new Date().toISOString() }
    store.applications.push(app)
    return app
}

export function getAllApplications(): StoredApplication[] {
    return getStore().applications
}

// ─── Caregiver Profile helpers ─────────────────────────────────────────────────

export function createCaregiverProfile(
    data: Omit<StoredCaregiverProfile, 'createdAt'>,
): StoredCaregiverProfile {
    const store = getStore()
    // replace if profile for this user already exists
    store.caregiverProfiles = store.caregiverProfiles.filter(
        (p) => p.userId !== data.userId,
    )
    const profile: StoredCaregiverProfile = { ...data, createdAt: new Date().toISOString() }
    store.caregiverProfiles.push(profile)
    return profile
}

export function getAllCaregiverProfiles(): StoredCaregiverProfile[] {
    return getStore().caregiverProfiles
}

export function getCaregiverProfileById(userId: number): StoredCaregiverProfile | undefined {
    return getStore().caregiverProfiles.find((p) => p.userId === userId)
}

export function updateCaregiverProfile(
    userId: number,
    patch: Partial<Omit<StoredCaregiverProfile, 'userId' | 'email' | 'createdAt'>>,
): StoredCaregiverProfile | null {
    const store = getStore()
    const idx = store.caregiverProfiles.findIndex((p) => p.userId === userId)
    if (idx === -1) return null
    store.caregiverProfiles[idx] = {
        ...store.caregiverProfiles[idx],
        ...patch,
        // recalculate primaryService if services array was updated
        primaryService: patch.services?.[0] ?? store.caregiverProfiles[idx].primaryService,
    }
    return store.caregiverProfiles[idx]
}

// ─── Relationship Score ───────────────────────────────────────────────────────

export interface RelationshipScore {
    level: RelationshipLevel
    bookingCount: number
    score: number   // 0–100
    color: string
    icon: string
}

/** How well a customer knows a caregiver, based on completed bookings together. */
export function getRelationshipScore(customerId: number, caregiverId: number): RelationshipScore {
    const count = getStore().bookings.filter(
        b => b.customerId === customerId && b.caregiverId === caregiverId && b.status === BookingStatus.Completed,
    ).length
    const score = Math.min(100, count * 20 + (count > 0 ? 10 : 0))
    if (count === 0) return { level: RelationshipLevel.New,      bookingCount: 0,     score: 0,   color: '#9E9E9E', icon: '👋' }
    if (count <= 2)  return { level: RelationshipLevel.Familiar, bookingCount: count, score,      color: '#FF8C00', icon: '🤝' }
    if (count <= 5)  return { level: RelationshipLevel.Regular,  bookingCount: count, score,      color: '#6C63FF', icon: '💜' }
    return             { level: RelationshipLevel.Trusted,  bookingCount: count, score: 100, color: '#2ECC71', icon: '⭐' }
}

// ─── Family Care Request helpers ─────────────────────────────────────────────

type NewCareRequestInput = Omit<StoredCareRequest, 'id' | 'createdAt' | 'updatedAt'>

export function createCareRequest(input: NewCareRequestInput): StoredCareRequest {
    const store = getStore()
    const now = new Date().toISOString()
    const request: StoredCareRequest = {
        ...input,
        id: store._nextRequestId++,
        createdAt: now,
        updatedAt: now,
    }
    store.careRequests.push(request)
    return request
}

export function getCareRequestsByCustomer(customerId: number): StoredCareRequest[] {
    return getStore()
        .careRequests
        .filter((request) => request.customerId === customerId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

    export function getAllCareRequests(): StoredCareRequest[] {
        return getStore()
        .careRequests
        .slice()
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

export function getCareRequestById(id: number): StoredCareRequest | undefined {
    return getStore().careRequests.find((request) => request.id === id)
}

export function updateCareRequest(
    id: number,
    patch: Partial<Omit<StoredCareRequest, 'id' | 'customerId' | 'createdAt'>>,
): StoredCareRequest | null {
    const store = getStore()
    const idx = store.careRequests.findIndex((request) => request.id === id)
    if (idx === -1) return null
    store.careRequests[idx] = {
        ...store.careRequests[idx],
        ...patch,
        updatedAt: new Date().toISOString(),
    }
    return store.careRequests[idx]
}



