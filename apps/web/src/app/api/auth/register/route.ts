import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, createUser, safeUser, createCaregiverProfile } from '@/lib/store'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
        email, password, firstName, lastName, phone, role,
        // caregiver-specific
        services, bio, experience, hourlyRate, city, certifications,
    } = body

    if (!email || !password || !firstName || !lastName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    if (findUserByEmail(email)) {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })
    }

    const user = createUser({
        email: email.toLowerCase().trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || '',
        role: role === 'CAREGIVER' ? 'CAREGIVER' : 'CUSTOMER',
    })

    if (role === 'CAREGIVER') {
        const svcList: string[] = Array.isArray(services) && services.length > 0
            ? services
            : ['SPECIAL_NEEDS_TRAINER']
        createCaregiverProfile({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            services: svcList,
            primaryService: svcList[0],
            bio: bio?.trim() || '',
            experience: Number(experience) || 0,
            hourlyRate: Number(hourlyRate) || 200,
            city: city?.trim() || 'Thailand',
            certifications: certifications?.trim() || '',
            isAvailable: true,
        })
    }

    return NextResponse.json({ user: safeUser(user) }, { status: 201 })
}


