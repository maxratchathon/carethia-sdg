export type ServiceType = 'SPECIAL_NEEDS_TRAINER'

export interface MockCaregiver {
    id: number
    firstName: string
    lastName: string
    avatar: string
    service: ServiceType
    services: ServiceType[]
    bio: string
    experience: number
    hourlyRate: number
    rating: number
    reviewCount: number
    city: string
    languages: string[]
    verified: boolean
    safetyScore: number
    careTrustScore: number
    certifications: string[]
    isAvailable: boolean
    specialties: string[]
    points: number   // loyalty points — determines Bronze/Silver/Gold tier
    shift?: 'DAY' | 'NIGHT' | 'BOTH'
}

export interface MockReview {
    id: number
    author: string
    avatar: string
    rating: number
    comment: string
    date: string
    serviceType: string
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
    SPECIAL_NEEDS_TRAINER: 'Special Needs Care',
}

export const COMMISSION_RATE = 0.15

// ─── Fixed fees (same for every caregiver & booking) ──────────────────────────
export const FIXED_SERVICE_FEE = 99   // flat ฿99 platform service fee per booking
export const INSURANCE_FEE = 49       // flat ฿49 insurance cover per booking

export const SERVICE_BASE_PRICE: Record<ServiceType, number> = {
    SPECIAL_NEEDS_TRAINER: 1500,
}

// Final price customer pays (caregiver rate + service fee + insurance)
export const CUSTOMER_RATE: Record<ServiceType, Record<'DAY' | 'NIGHT' | 'BOTH', number>> = {
    SPECIAL_NEEDS_TRAINER: { DAY: 390, NIGHT: 490, BOTH: 390 },
}

export const SERVICE_ICONS: Record<ServiceType, string> = {
    SPECIAL_NEEDS_TRAINER: '🧠',
}

export const SERVICE_COLORS: Record<ServiceType, string> = {
    SPECIAL_NEEDS_TRAINER: '#9B59B6',
}

export const mockCaregivers: MockCaregiver[] = [
    {
        id: 1,
        firstName: 'Nida',
        lastName: 'Somchai',
        avatar: 'https://i.pravatar.cc/150?img=47',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Warm, patient special needs caregiver with 6+ years of experience supporting people with special needs with daily living, companionship, and post-hospital recovery. First-aid certified, fluent in Thai and English.',
        experience: 6,
        hourlyRate: 400,
        rating: 4.9,
        reviewCount: 127,
        city: 'Chiang Rai',
        languages: ['Thai', 'English'],
        verified: true,
        safetyScore: 98,
        careTrustScore: 95,
        certifications: ['CPR & First Aid', 'Special Needs Care Certificate'],
        isAvailable: true,
        specialties: ['Companionship', 'Post-hospital Recovery', 'Daily Living Support'],
        points: 3200,
        shift: 'DAY',
    },
    {
        id: 2,
        firstName: 'Malee',
        lastName: 'Thanakit',
        avatar: 'https://i.pravatar.cc/150?img=45',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Registered nurse with 10 years of clinical experience. Specialized in post-operative care, wound management, and chronic disease management. Compassionate, professional, and always on time.',
        experience: 10,
        hourlyRate: 400,
        rating: 4.8,
        reviewCount: 89,
        city: 'Khon Kaen',
        languages: ['Thai', 'English'],
        verified: true,
        safetyScore: 99,
        careTrustScore: 92,
        certifications: ['Registered Nurse License', 'IV Therapy Certification', 'CPR Advanced'],
        isAvailable: true,
        specialties: ['Post-op Care', 'Wound Care', 'Special Needs Care'],
        points: 2600,
        shift: 'BOTH',
    },
    {
        id: 3,
        firstName: 'Pornpan',
        lastName: 'Wattana',
        avatar: 'https://i.pravatar.cc/150?img=44',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Dedicated special needs companion with 8 years of experience supporting individuals with physical and developmental disabilities. Trained in sensory integration, adaptive communication, and daily skill building.',
        experience: 8,
        hourlyRate: 300,
        rating: 4.7,
        reviewCount: 203,
        city: 'Hat Yai',
        languages: ['Thai'],
        verified: true,
        safetyScore: 97,
        careTrustScore: 91,
        certifications: ['Disability Support Certificate', 'Sensory Integration Training', 'Background Verified'],
        isAvailable: true,
        specialties: ['Physical Disabilities', 'Sensory Integration', 'Daily Skill Building'],
        points: 2100,
        shift: 'DAY',
    },
    {
        id: 4,
        firstName: 'Aisha',
        lastName: 'Rahman',
        avatar: 'https://i.pravatar.cc/150?img=48',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Special education teacher and ABA therapist with 7 years working with children on the autism spectrum, ADHD, and Down syndrome. Gentle, structured, and results-driven.',
        experience: 7,
        hourlyRate: 400,
        rating: 5.0,
        reviewCount: 64,
        city: 'Nakhon Ratchasima',
        languages: ['Thai', 'English', 'Malay'],
        verified: true,
        safetyScore: 100,
        careTrustScore: 98,
        certifications: ['ABA Therapy Certification', 'Special Education Degree', 'Behavioral Analyst'],
        isAvailable: false,
        specialties: ['Autism ABA', 'ADHD Coaching', 'Sensory Processing'],
        points: 1450,
        shift: 'NIGHT',
    },
    {
        id: 5,
        firstName: 'Priya',
        lastName: 'Sharma',
        avatar: 'https://i.pravatar.cc/150?img=41',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Former special education teacher with 9 years of experience working with children and adults with learning differences including Down syndrome, cerebral palsy, and autism. Structured, compassionate, and results-driven.',
        experience: 9,
        hourlyRate: 300,
        rating: 4.9,
        reviewCount: 156,
        city: 'Chiang Mai',
        languages: ['English', 'Thai', 'Hindi'],
        verified: true,
        safetyScore: 98,
        careTrustScore: 93,
        certifications: ['Special Education Degree', 'Behavioral Support Training', 'CPR Certified'],
        isAvailable: true,
        specialties: ['Down Syndrome', 'Cerebral Palsy', 'Learning Differences'],
        points: 890,
        shift: 'BOTH',
    },
    {
        id: 6,
        firstName: 'Suda',
        lastName: 'Pimchanok',
        avatar: 'https://i.pravatar.cc/150?img=43',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Compassionate special-needs caregiver with 12 years of experience. Skilled in mobility assistance, medication reminders, behavior support, and companionship. Background in occupational therapy.',
        experience: 12,
        hourlyRate: 500,
        rating: 4.8,
        reviewCount: 112,
        city: 'Ayutthaya',
        languages: ['Thai', 'English'],
        verified: true,
        safetyScore: 99,
        careTrustScore: 97,
        certifications: ['Dementia Care Specialist', 'Occupational Therapy Assistant', 'CPR Certified'],
        isAvailable: true,
        specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management'],
        points: 3800,
        shift: 'NIGHT',
    },
    {
        id: 7,
        firstName: 'Lalita',
        lastName: 'Boonmee',
        avatar: 'https://i.pravatar.cc/150?img=49',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Gentle and experienced night caregiver specializing in sleep support, fall prevention, and overnight monitoring for people with special needs. Trusted by families across Thailand for 5+ years.',
        experience: 5,
        hourlyRate: 500,
        rating: 4.8,
        reviewCount: 74,
        city: 'Udon Thani',
        languages: ['Thai'],
        verified: true,
        safetyScore: 96,
        careTrustScore: 90,
        certifications: ['Special Needs Care Certificate', 'Fall Prevention Training', 'CPR Certified'],
        isAvailable: true,
        specialties: ['Overnight Monitoring', 'Fall Prevention', 'Sleep Support'],
        points: 720,
        shift: 'NIGHT',
    },
    {
        id: 8,
        firstName: 'Chanida',
        lastName: 'Ruangrit',
        avatar: 'https://i.pravatar.cc/150?img=36',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Occupational therapist with 6 years specializing in children with cerebral palsy and sensory processing disorders. Warm approach that builds confidence and real-world daily skills.',
        experience: 6,
        hourlyRate: 300,
        rating: 4.9,
        reviewCount: 88,
        city: 'Chiang Mai',
        languages: ['Thai', 'English'],
        verified: true,
        safetyScore: 97,
        careTrustScore: 94,
        certifications: ['Occupational Therapy License', 'Sensory Processing Certification', 'CPR Certified'],
        isAvailable: true,
        specialties: ['Cerebral Palsy', 'Sensory Processing', 'Fine Motor Skills'],
        points: 1100,
        shift: 'DAY',
    },
    {
        id: 9,
        firstName: 'Wipawan',
        lastName: 'Siriporn',
        avatar: 'https://i.pravatar.cc/150?img=39',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Dedicated day caregiver for people with special needs with Alzheimer\'s and Parkinson\'s. Trained in reality orientation therapy and gentle exercise routines. Speaks clear, calm Thai to ease anxiety.',
        experience: 8,
        hourlyRate: 400,
        rating: 4.7,
        reviewCount: 61,
        city: 'Phuket',
        languages: ['Thai'],
        verified: true,
        safetyScore: 95,
        careTrustScore: 89,
        certifications: ['Dementia Care Specialist', 'Parkinson\'s Care Training', 'First Aid'],
        isAvailable: true,
        specialties: ['Alzheimer\'s Care', 'Parkinson\'s Support', 'Reality Orientation Therapy'],
        points: 540,
        shift: 'DAY',
    },
    {
        id: 10,
        firstName: 'Nattaporn',
        lastName: 'Kaewkla',
        avatar: 'https://i.pravatar.cc/150?img=32',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Speech-language pathologist with 5 years helping non-verbal and minimally verbal children develop communication skills. Combines PECS, AAC devices, and play-based therapy.',
        experience: 5,
        hourlyRate: 300,
        rating: 4.9,
        reviewCount: 47,
        city: 'Surat Thani',
        languages: ['Thai', 'English'],
        verified: true,
        safetyScore: 98,
        careTrustScore: 96,
        certifications: ['Speech-Language Pathology Degree', 'AAC Specialist', 'PECS Level II'],
        isAvailable: true,
        specialties: ['Speech Therapy', 'AAC Communication', 'Non-verbal Support'],
        points: 430,
        shift: 'BOTH',
    },
    {
        id: 11,
        firstName: 'Kanya',
        lastName: 'Phommasak',
        avatar: 'https://i.pravatar.cc/150?img=33',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Night nurse with ICU background, now focusing on home-based overnight special needs care. Expert in managing chronic conditions, night medication schedules, and emergency response.',
        experience: 11,
        hourlyRate: 500,
        rating: 5.0,
        reviewCount: 39,
        city: 'Ubon Ratchathani',
        languages: ['Thai', 'English'],
        verified: true,
        safetyScore: 100,
        careTrustScore: 99,
        certifications: ['ICU Nursing Certificate', 'Advanced CPR', 'Special Needs Night Care Training'],
        isAvailable: true,
        specialties: ['Chronic Disease Management', 'Night Medication', 'Emergency Response'],
        points: 280,
        shift: 'NIGHT',
    },
    {
        id: 12,
        firstName: 'Saowalak',
        lastName: 'Thipwan',
        avatar: 'https://i.pravatar.cc/150?img=35',
        service: 'SPECIAL_NEEDS_TRAINER',
        services: ['SPECIAL_NEEDS_TRAINER'],
        bio: 'Physical therapist specializing in children with muscular dystrophy and mobility impairments. Creates fun, motivating exercise plans that families can continue at home.',
        experience: 7,
        hourlyRate: 300,
        rating: 4.8,
        reviewCount: 55,
        city: 'Pattaya',
        languages: ['Thai', 'English'],
        verified: true,
        safetyScore: 97,
        careTrustScore: 92,
        certifications: ['Physical Therapy License', 'Pediatric Rehabilitation', 'CPR Certified'],
        isAvailable: false,
        specialties: ['Muscular Dystrophy', 'Mobility Training', 'Home Exercise Programs'],
        points: 660,
        shift: 'DAY',
    },
]

export const mockReviews: Record<number, MockReview[]> = {
    1: [
        { id: 1, author: 'Kannika P.', avatar: 'https://i.pravatar.cc/40?img=5', rating: 5, comment: 'Nida is absolutely wonderful with my daughter who has special needs! She always keeps me updated. Highly recommended!', date: 'Feb 2026', serviceType: 'Special Needs Care' },
        { id: 2, author: 'Wanida K.', avatar: 'https://i.pravatar.cc/40?img=10', rating: 5, comment: 'Super reliable, always on time. My mother looks forward to her visits!', date: 'Jan 2026', serviceType: 'Special Needs Care' },
        { id: 3, author: 'Somlak T.', avatar: 'https://i.pravatar.cc/40?img=15', rating: 5, comment: 'Professional and caring. Nida has been with us for 4 months and it feels like family.', date: 'Dec 2025', serviceType: 'Special Needs Care' },
    ],
    2: [
        { id: 1, author: 'Rattana J.', avatar: 'https://i.pravatar.cc/40?img=20', rating: 5, comment: 'Malee took amazing care of my mother after surgery. She is a true professional.', date: 'Feb 2026', serviceType: 'Special Needs Care' },
        { id: 2, author: 'Kanchana F.', avatar: 'https://i.pravatar.cc/40?img=22', rating: 5, comment: 'Exceptional knowledge and warm personality. Would not trust anyone else.', date: 'Jan 2026', serviceType: 'Special Needs Care' },
    ],
    3: [
        { id: 1, author: 'Praew S.', avatar: 'https://i.pravatar.cc/40?img=25', rating: 5, comment: 'Pornpan is so patient and skilled with my son. He has made incredible progress!', date: 'Feb 2026', serviceType: 'Special Needs Care' },
        { id: 2, author: 'Nuch B.', avatar: 'https://i.pravatar.cc/40?img=28', rating: 4, comment: 'Very thorough and pleasant to have around. Will definitely book again.', date: 'Jan 2026', serviceType: 'Special Needs Care' },
    ],
}

// ─── Community / Offline Event Ads (shown on landing page hero) ───────────────
export interface CommunityAd {
    id: number
    emoji: string
    title: string
    date: string
    location: string
    badge: string
    badgeColor: string
    desc: string
}

export const COMMUNITY_ADS: CommunityAd[] = [
    {
        id: 1,
        emoji: '🎓',
        title: 'Caregiver Skills Workshop',
        date: 'Sat, 15 Mar 2026',
        location: 'Chiang Mai City, Chiang Mai',
        badge: 'Free Event',
        badgeColor: '#2ECC71',
        desc: 'CPR, child safety & professional care techniques. Open to all.',
    },
    {
        id: 2,
        emoji: '🌸',
        title: 'Family Caregivers Networking Night',
        date: 'Sun, 22 Mar 2026',
        location: 'Phuket Town, Phuket',
        badge: 'Community',
        badgeColor: '#FF6B9D',
        desc: 'Monthly meet-up for family caregivers to connect, share, and support each other.',
    },
    {
        id: 3,
        emoji: '🏥',
        title: 'Child First Aid Certification',
        date: 'Sat, 5 Apr 2026',
        location: 'Khon Kaen City, Khon Kaen',
        badge: 'Limited Seats',
        badgeColor: '#FF8C00',
        desc: 'Hands-on first aid for parents and caregivers. Certified instructor.',
    },
]


