import { NextRequest, NextResponse } from 'next/server'
import { getCaregiverProfileById, updateCaregiverProfile } from '@/lib/store'
import { profileToCard } from '@/lib/caregiverUtils'

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    const userId = Number(params.id)
    if (isNaN(userId)) {
        return NextResponse.json({ error: 'Invalid caregiver ID' }, { status: 400 })
    }
    const profile = getCaregiverProfileById(userId)
    if (!profile) {
        return NextResponse.json({ error: 'Caregiver not found' }, { status: 404 })
    }
    return NextResponse.json({ caregiver: profileToCard(profile) })
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const userId = Number(params.id)
    if (isNaN(userId)) {
        return NextResponse.json({ error: 'Invalid caregiver ID' }, { status: 400 })
    }
    const body = await req.json()
    const { bio, services, hourlyRate, experience, city, certifications, isAvailable } = body
    const patch: Record<string, unknown> = {}
    if (bio !== undefined) patch.bio = bio
    if (Array.isArray(services) && services.length > 0) patch.services = services
    if (hourlyRate !== undefined) patch.hourlyRate = Number(hourlyRate)
    if (experience !== undefined) patch.experience = Number(experience)
    if (city !== undefined) patch.city = city
    if (certifications !== undefined) patch.certifications = certifications
    if (isAvailable !== undefined) patch.isAvailable = Boolean(isAvailable)
    const updated = updateCaregiverProfile(userId, patch)
    if (!updated) {
        return NextResponse.json({ error: 'Caregiver profile not found' }, { status: 404 })
    }
    return NextResponse.json({ profile: updated })
}
