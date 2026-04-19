import { NextRequest, NextResponse } from 'next/server'
import { createBooking, getBookingsByCustomer, getBookingsByCaregiver } from '@/lib/store'
import { BookingStatus } from '@/lib/types'
import { INSURANCE_FEE } from '@/lib/mockData'

const PLATFORM_FEE_RATE = 0.15
const TAX_RATE = 0.07

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId')
    const caregiverId = req.nextUrl.searchParams.get('caregiverId')

    if (caregiverId && !isNaN(Number(caregiverId))) {
        const bookings = getBookingsByCaregiver(Number(caregiverId))
        return NextResponse.json({ bookings })
    }

    if (!userId || isNaN(Number(userId))) {
        return NextResponse.json({ error: 'Valid userId or caregiverId is required' }, { status: 400 })
    }
    const bookings = getBookingsByCustomer(Number(userId))
    return NextResponse.json({ bookings })
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
        customerId, customerName,
        caregiverId, caregiverName, caregiverAvatar,
        serviceType, serviceName,
        date, time, hours, hourlyRate,
        includeInsurance,
        isEmergency, notes,
    } = body

    if (!customerId || !caregiverId || !date || !hours || !hourlyRate) {
        return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    const baseTotal = hourlyRate * hours
    const emergencySurcharge = isEmergency ? Math.round(baseTotal * 0.2) : 0
    const platformFee = Math.round(baseTotal * PLATFORM_FEE_RATE)
    const taxFee = Math.round(baseTotal * TAX_RATE)
    const insuranceFee = includeInsurance === false ? 0 : INSURANCE_FEE
    const totalPrice = baseTotal + emergencySurcharge + platformFee + taxFee + insuranceFee

    const booking = createBooking({
        customerId: Number(customerId),
        customerName: customerName || '',
        caregiverId: Number(caregiverId),
        caregiverName: caregiverName || '',
        caregiverAvatar: caregiverAvatar || '',
        serviceType: serviceType || '',
        serviceName: serviceName || '',
        date,
        time: time || '09:00 AM',
        hours: Number(hours),
        totalPrice,
        platformFee,
        isEmergency: Boolean(isEmergency),
        notes: notes || '',
        status: BookingStatus.Confirmed,
    })

    return NextResponse.json({ booking }, { status: 201 })
}
