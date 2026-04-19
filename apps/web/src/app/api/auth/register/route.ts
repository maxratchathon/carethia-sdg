import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, createUser, safeUser, createCaregiverProfile } from '@/lib/store'
import { UserRole } from '@/lib/types'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
        email, password, firstName, lastName, phone, role,
        // caregiver-specific profile fields from register page
        country, caregiverType,
        nativeDialect, secondaryLanguages, hometown, communicationStyle,
        spiritualSkills, culinarySpecialties, education, clinicalSkills,
        mobilitySupport, conditionExperience, yearsExperience,
        motherTongue, dialect, storytellingLevel, musicalHeritage, vocabBreadth,
        ritualMastery, ethnicDishes, calendarAwareness,
        culturalActivities, explanationAbility, usesArtifacts,
        communityInvolvement, pridStatement, traditionalAttire,
        // fallback optional fields
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
        role: role === 'CAREGIVER' ? UserRole.Caregiver : UserRole.Customer,
    })

    if (role === 'CAREGIVER') {
        const svcList: string[] = Array.isArray(services) && services.length > 0
            ? services
            : ['SPECIAL_NEEDS_TRAINER', 'DAILY_LIVING_COMPANION']

        const normalizedCountry = typeof country === 'string' ? country.trim() : ''
        const isThai = caregiverType === 'THAI' || normalizedCountry === 'Thailand'

        const derivedLanguages = isThai
            ? ['Thai', ...(Array.isArray(secondaryLanguages) ? secondaryLanguages : [])]
            : [
                ...(typeof motherTongue === 'string' && motherTongue.trim() ? [motherTongue.trim()] : []),
                ...(typeof dialect === 'string' && dialect.trim() ? [dialect.trim()] : []),
                'Thai',
              ]

        const derivedSpecialties = isThai
            ? [
                ...(Array.isArray(conditionExperience) ? conditionExperience : []),
                ...(Array.isArray(clinicalSkills) ? clinicalSkills : []),
                ...(Array.isArray(spiritualSkills) ? spiritualSkills : []),
                ...(Array.isArray(culinarySpecialties) ? culinarySpecialties : []),
              ]
            : [
                ...(Array.isArray(musicalHeritage) ? musicalHeritage : []),
                ...(Array.isArray(calendarAwareness) ? calendarAwareness : []),
                ...(Array.isArray(culturalActivities) ? culturalActivities : []),
              ]

        const compact = (arr: unknown[]) => Array.from(new Set(arr.filter((v) => typeof v === 'string' && v.trim()).map((v) => (v as string).trim())))
        const languages = compact(derivedLanguages)
        const specialties = compact(derivedSpecialties)

        const derivedExperience = Number(experience)
            || Number(yearsExperience)
            || 0

        const derivedCity = typeof city === 'string' && city.trim()
            ? city.trim()
            : (typeof hometown === 'string' && hometown.trim()
                ? hometown.trim()
                : (normalizedCountry || 'Thailand'))

        const certificationParts: string[] = []
        if (typeof education === 'string' && education.trim()) certificationParts.push(education.trim())
        if (Array.isArray(clinicalSkills)) certificationParts.push(...clinicalSkills)
        if (Array.isArray(conditionExperience)) certificationParts.push(...conditionExperience)
        if (typeof storytellingLevel === 'string' && storytellingLevel.trim()) certificationParts.push(storytellingLevel.trim())
        if (typeof vocabBreadth === 'string' && vocabBreadth.trim()) certificationParts.push(vocabBreadth.trim())
        if (typeof certifications === 'string' && certifications.trim()) certificationParts.push(...certifications.split(',').map((s: string) => s.trim()))
        const derivedCertifications = compact(certificationParts).join(', ')

        const fallbackBioThai = [
            `Thai caregiver from ${derivedCity}.`,
            typeof communicationStyle === 'string' && communicationStyle ? `Communication style: ${communicationStyle}.` : '',
            typeof mobilitySupport === 'string' && mobilitySupport ? `Mobility support: ${mobilitySupport}.` : '',
        ].filter(Boolean).join(' ')

        const fallbackBioForeign = [
            `Cultural caregiver from ${normalizedCountry || 'international background'}.`,
            typeof motherTongue === 'string' && motherTongue ? `Mother tongue: ${motherTongue}.` : '',
            typeof ritualMastery === 'string' && ritualMastery ? `Ritual knowledge: ${ritualMastery}` : '',
            typeof explanationAbility === 'string' && explanationAbility ? `Child explanation style: ${explanationAbility}` : '',
        ].filter(Boolean).join(' ')

        const derivedBio = typeof bio === 'string' && bio.trim()
            ? bio.trim()
            : (isThai ? fallbackBioThai : fallbackBioForeign)

        const shift: 'DAY' | 'NIGHT' | 'BOTH' = (isThai ? 'DAY' : 'BOTH')
        const derivedAvatar = `https://i.pravatar.cc/150?img=${((user.id - 1) % 70) + 1}`

        createCaregiverProfile({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: derivedAvatar,
            services: svcList,
            primaryService: svcList[0],
            bio: derivedBio,
            experience: derivedExperience,
            hourlyRate: Number(hourlyRate) || 300,
            city: derivedCity,
            certifications: derivedCertifications,
            languages,
            specialties,
            shift,
            rating: 4.5,
            reviewCount: 1,
            isAvailable: true,
        })
    }

    return NextResponse.json({ user: safeUser(user) }, { status: 201 })
}


