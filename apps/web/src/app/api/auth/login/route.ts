import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, safeUser } from '@/lib/store'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = findUserByEmail(email.toLowerCase().trim())
    if (!user || user.password !== password) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    return NextResponse.json({ user: safeUser(user) })
}
