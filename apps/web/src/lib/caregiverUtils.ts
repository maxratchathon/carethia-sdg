import type { StoredCaregiverProfile } from '@/lib/store'

/** Convert a stored profile into the MockCaregiver-compatible shape the frontend expects */
export function profileToCard(p: StoredCaregiverProfile) {
    return {
        id: p.userId,
        firstName: p.firstName,
        lastName: p.lastName,
        avatar: `https://i.pravatar.cc/150?img=${((p.userId - 1) % 70) + 1}`,
        service: p.primaryService,
        services: p.services,
        bio: p.bio || 'No bio provided yet.',
        experience: p.experience,
        hourlyRate: p.hourlyRate,
        rating: 0,
        reviewCount: 0,
        city: p.city || 'Thailand',
        languages: ['Thai'],
        verified: false,
        safetyScore: 0,
        careTrustScore: 0,
        certifications: p.certifications
            ? p.certifications.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [],
        isAvailable: p.isAvailable,
        specialties: [],
        isNew: true,
        shift: 'DAY' as const,
    }
}
