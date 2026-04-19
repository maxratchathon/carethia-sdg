import type { StoredCaregiverProfile } from '@/lib/store'

/** Convert a stored profile into the MockCaregiver-compatible shape the frontend expects */
export function profileToCard(p: StoredCaregiverProfile) {
    return {
        id: p.userId,
        firstName: p.firstName,
        lastName: p.lastName,
        avatar: p.avatar || `https://i.pravatar.cc/150?img=${((p.userId - 1) % 70) + 1}`,
        service: p.primaryService as 'SPECIAL_NEEDS_TRAINER' | 'DAILY_LIVING_COMPANION',
        services: p.services as Array<'SPECIAL_NEEDS_TRAINER' | 'DAILY_LIVING_COMPANION'>,
        bio: p.bio || 'No bio provided yet.',
        experience: p.experience,
        hourlyRate: p.hourlyRate,
        rating: p.rating ?? 4.6,
        reviewCount: p.reviewCount ?? 12,
        city: p.city || 'Thailand',
        languages: p.languages && p.languages.length > 0 ? p.languages : ['Thai'],
        verified: false,
        safetyScore: 0,
        careTrustScore: 0,
        certifications: p.certifications
            ? p.certifications.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [],
        isAvailable: p.isAvailable,
        specialties: p.specialties ?? [],
        points: 0,
        isNew: true,
        shift: p.shift ?? ('DAY' as const),
    }
}
