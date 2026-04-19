import { NextRequest, NextResponse } from 'next/server'
import {
    createCareRequest,
    getAllCareRequests,
    getCareRequestsByCustomer,
    type FamilyContextType,
    type SpecialNeedsServiceType,
    type CareRequestStatus,
} from '@/lib/store'

export async function GET(req: NextRequest) {
    const customerIdRaw = req.nextUrl.searchParams.get('customerId')
    const serviceType = req.nextUrl.searchParams.get('serviceType')
    const status = req.nextUrl.searchParams.get('status')

    if (customerIdRaw) {
        const customerId = Number(customerIdRaw)
        if (Number.isNaN(customerId)) {
            return NextResponse.json({ error: 'Valid customerId is required' }, { status: 400 })
        }
        const requests = getCareRequestsByCustomer(customerId)
        return NextResponse.json({ requests })
    }

    let requests = getAllCareRequests()

    if (serviceType) {
        requests = requests.filter((request) => request.serviceType === serviceType)
    }
    if (status) {
        requests = requests.filter((request) => request.status === status)
    }

    return NextResponse.json({ requests })
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (!body?.customerId || !body?.serviceType || !body?.title) {
            return NextResponse.json({ error: 'customerId, serviceType, and title are required' }, { status: 400 })
        }

        const serviceType = body.serviceType as SpecialNeedsServiceType
        if (serviceType !== 'SPECIAL_NEEDS_TRAINER' && serviceType !== 'DAILY_LIVING_COMPANION') {
            return NextResponse.json({ error: 'Invalid serviceType value' }, { status: 400 })
        }

        const request = createCareRequest({
            customerId: Number(body.customerId),
            serviceType,
            status: (body.status as CareRequestStatus) || 'DRAFT',
            title: String(body.title),
            startDate: body.startDate || new Date().toISOString().split('T')[0],
            locationCity: body.locationCity || 'Bangkok',
            budgetMin: Number(body.budgetMin) || 200,
            budgetMax: Number(body.budgetMax) || 500,
            schedule: Array.isArray(body.schedule) && body.schedule.length > 0 ? body.schedule : ['DAY'],
            mustHaveLanguages: Array.isArray(body.mustHaveLanguages) ? body.mustHaveLanguages : [],
            mustHaveSkills: Array.isArray(body.mustHaveSkills) ? body.mustHaveSkills : [],
            niceToHaveSkills: Array.isArray(body.niceToHaveSkills) ? body.niceToHaveSkills : [],
            familyContext: (body.familyContext as FamilyContextType) || 'THAI_LOCAL',
            dialectImportance: Number(body.dialectImportance) || 50,
            regionalImportance: Number(body.regionalImportance) || 50,
            culturalPriority: body.culturalPriority || 'MEDIUM',
            culturalRequirements: Array.isArray(body.culturalRequirements) ? body.culturalRequirements : [],
            matchWeightRequirement: Number(body.matchWeightRequirement) || 40,
            matchWeightService: Number(body.matchWeightService) || 35,
            matchWeightCultural: Number(body.matchWeightCultural) || 25,
            requirementsText: typeof body.requirementsText === 'string' ? body.requirementsText : '',
            familyStoryText: typeof body.familyStoryText === 'string' ? body.familyStoryText : '',
            childAgeBand: body.childAgeBand,
            childGoals: Array.isArray(body.childGoals) ? body.childGoals : [],
            childConditions: Array.isArray(body.childConditions) ? body.childConditions : [],
            childSessionStyle: body.childSessionStyle,
            recipientAgeBand: body.recipientAgeBand,
            mobilityLevel: body.mobilityLevel,
            dailyTaskPriorities: Array.isArray(body.dailyTaskPriorities) ? body.dailyTaskPriorities : [],
            complexityLevel: body.complexityLevel,
            interactionStyle: body.interactionStyle,
        })

        return NextResponse.json({ request }, { status: 201 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected server error while creating request.'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
