import { NextRequest, NextResponse } from 'next/server'
import { getRelationshipScore } from '@/lib/store'

export async function GET(req: NextRequest) {
    const customerId = Number(req.nextUrl.searchParams.get('customerId'))
    const caregiverId = Number(req.nextUrl.searchParams.get('caregiverId'))

    if (!customerId || !caregiverId) {
        return NextResponse.json({ error: 'customerId and caregiverId are required' }, { status: 400 })
    }

    const score = getRelationshipScore(customerId, caregiverId)
    return NextResponse.json({ score })
}
