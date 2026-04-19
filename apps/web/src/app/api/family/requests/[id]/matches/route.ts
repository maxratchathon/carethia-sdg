import { NextRequest, NextResponse } from 'next/server'
import { getCareRequestById } from '@/lib/store'
import { getMatchesForRequest } from '@/lib/familyMatching'

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
        return NextResponse.json({ error: 'Invalid request id' }, { status: 400 })
    }

    const request = getCareRequestById(id)
    if (!request) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const matches = getMatchesForRequest(request)
    return NextResponse.json({ request, matches })
}
