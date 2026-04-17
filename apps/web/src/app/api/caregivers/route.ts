import { NextResponse } from 'next/server'
import { getAllCaregiverProfiles } from '@/lib/store'
import { profileToCard } from '@/lib/caregiverUtils'

export async function GET() {
    const profiles = getAllCaregiverProfiles()
    const caregivers = profiles.map(profileToCard)
    return NextResponse.json({ caregivers })
}
