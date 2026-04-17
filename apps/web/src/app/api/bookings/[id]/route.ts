import { NextRequest, NextResponse } from 'next/server'
import { updateBookingStatus } from '@/lib/store'

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const bookingId = Number(params.id)
    if (isNaN(bookingId)) {
        return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
    }

    const body = await req.json()
    const { status, currentStatus } = body

    const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? []
    if (!allowed.includes(status)) {
        return NextResponse.json(
            { error: `Cannot transition from ${currentStatus} to ${status}` },
            { status: 422 },
        )
    }

    const booking = updateBookingStatus(bookingId, status)
    if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ booking })
}
