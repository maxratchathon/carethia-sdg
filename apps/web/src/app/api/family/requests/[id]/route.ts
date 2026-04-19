import { NextRequest, NextResponse } from 'next/server'
import { getCareRequestById, updateCareRequest } from '@/lib/store'

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

    return NextResponse.json({ request })
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
        return NextResponse.json({ error: 'Invalid request id' }, { status: 400 })
    }

    const patch = await req.json()
    const updated = updateCareRequest(id, patch)
    if (!updated) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    return NextResponse.json({ request: updated })
}
