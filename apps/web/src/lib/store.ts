// In-memory array database — perfect for hackathon MVP
// Data persists for the lifetime of the Next.js server process

export interface StoredUser {
    id: number
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: 'CUSTOMER' | 'CAREGIVER' | 'ADMIN'
    points: number   // loyalty points — drives Bronze/Silver/Gold tier
    createdAt: string
}

export interface StoredBooking {
    id: number
    customerId: number
    customerName: string
    caregiverId: number
    caregiverName: string
    caregiverAvatar: string
    serviceType: string
    serviceName: string
    date: string
    time: string
    hours: number
    totalPrice: number
    platformFee: number
    isEmergency: boolean
    notes: string
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
    createdAt: string
}

export interface StoredApplication {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    services: string[]
    experience: number
    bio: string
    certifications: string
    hourlyRate: number
    city: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
}

export interface StoredCaregiverProfile {
    userId: number          // same as the user's ID
    firstName: string
    lastName: string
    email: string
    services: string[]
    primaryService: string  // services[0]
    bio: string
    experience: number
    hourlyRate: number
    city: string
    certifications: string  // raw comma-separated string from form
    isAvailable: boolean
    createdAt: string
}

export const TIER_CONFIG = [
    { name: 'Bronze', icon: '🥉', min: 0, max: 499, color: '#CD7F32', fee: '฿99', bg: '#FFF8F2' },
    { name: 'Silver', icon: '🥈', min: 500, max: 1999, color: '#6C63FF', fee: '฿79', bg: '#F3F2FF' },
    { name: 'Gold', icon: '🥇', min: 2000, max: Infinity, color: '#FF8C00', fee: '฿59', bg: '#FFF8F0' },
] as const

export type TierName = 'Bronze' | 'Silver' | 'Gold'

export function getTier(points: number): typeof TIER_CONFIG[number] {
    return [...TIER_CONFIG].reverse().find(t => points >= t.min) ?? TIER_CONFIG[0]
}

interface StoreData {
    users: StoredUser[]
    bookings: StoredBooking[]
    applications: StoredApplication[]
    caregiverProfiles: StoredCaregiverProfile[]
    _nextUserId: number
    _nextBookingId: number
    _nextAppId: number
}

// Seeded demo data
const SEED_USERS: StoredUser[] = [
    {
        id: 1,
        email: 'siriporn@example.com',
        password: 'demo1234',
        firstName: 'Siriporn',
        lastName: 'Wattana',
        phone: '0812345678',
        role: 'CUSTOMER',
        points: 380,
        createdAt: new Date('2026-01-01').toISOString(),
    },
    {
        id: 2,
        email: 'nida@example.com',
        password: 'demo1234',
        firstName: 'Nida',
        lastName: 'Somchai',
        phone: '0823456789',
        role: 'CAREGIVER',
        points: 1250,
        createdAt: new Date('2026-01-02').toISOString(),
    },
    {
        id: 3,
        email: 'admin@carethia.com',
        password: 'admin1234',
        firstName: 'Admin',
        lastName: 'Carethia',
        phone: '0800000000',
        role: 'ADMIN',
        points: 2500,
        createdAt: new Date('2026-01-01').toISOString(),
    },
]

const SEED_BOOKINGS: StoredBooking[] = [
    // ── Bookings for Customer Siriporn (customerId=1) ──────────────────────────
    {
        id: 1,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 10,
        caregiverName: 'Anong Pimjai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=47',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-10',
        time: '09:00 AM',
        hours: 3,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: 'CONFIRMED',
        createdAt: new Date('2026-03-01').toISOString(),
    },
    {
        id: 2,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 3,
        caregiverName: 'Pornpan Wattana',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=44',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-15',
        time: '02:00 PM',
        hours: 4,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: 'Please bring your own cleaning supplies.',
        status: 'PENDING',
        createdAt: new Date('2026-03-02').toISOString(),
    },
    {
        id: 3,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 2,
        caregiverName: 'Malee Thanakit',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=45',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-02-20',
        time: '08:00 AM',
        hours: 4,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: 'COMPLETED',
        createdAt: new Date('2026-02-15').toISOString(),
    },
    {
        id: 4,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 4,
        caregiverName: 'Aisha Rahman',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=48',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-02-10',
        time: '10:00 AM',
        hours: 2,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: 'My son has ADHD. Please be patient.',
        status: 'COMPLETED',
        createdAt: new Date('2026-02-05').toISOString(),
    },
    // ── Bookings FOR Caregiver Nida (caregiverId=2) ────────────────────────────
    {
        id: 5,
        customerId: 1,
        customerName: 'Siriporn Wattana',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-12',
        time: '09:00 AM',
        hours: 4,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: 'Two kids, ages 3 and 5. Please bring craft supplies.',
        status: 'PENDING',
        createdAt: new Date('2026-03-06').toISOString(),
    },
    {
        id: 6,
        customerId: 20,
        customerName: 'Malee Jaidee',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-14',
        time: '02:00 PM',
        hours: 3,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: 'Infant care — baby is 8 months.',
        status: 'PENDING',
        createdAt: new Date('2026-03-06').toISOString(),
    },
    {
        id: 7,
        customerId: 21,
        customerName: 'Pranee Sukjai',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-09',
        time: '10:00 AM',
        hours: 5,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: 'CONFIRMED',
        createdAt: new Date('2026-03-04').toISOString(),
    },
    {
        id: 8,
        customerId: 22,
        customerName: 'Wilai Boonsong',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-03-08',
        time: '08:00 AM',
        hours: 6,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: true,
        notes: 'Emergency booking — husband hospitalized.',
        status: 'CONFIRMED',
        createdAt: new Date('2026-03-07').toISOString(),
    },
    {
        id: 9,
        customerId: 23,
        customerName: 'Suparat Thong',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-02-25',
        time: '09:00 AM',
        hours: 4,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: 'COMPLETED',
        createdAt: new Date('2026-02-20').toISOString(),
    },
    {
        id: 10,
        customerId: 24,
        customerName: 'Nopparat Klahan',
        caregiverId: 2,
        caregiverName: 'Nida Somchai',
        caregiverAvatar: 'https://i.pravatar.cc/150?img=32',
        serviceType: 'SPECIAL_NEEDS_TRAINER',
        serviceName: 'Special Needs Care',
        date: '2026-02-18',
        time: '01:00 PM',
        hours: 3,
        totalPrice: 800,
        platformFee: 120,
        isEmergency: false,
        notes: '',
        status: 'COMPLETED',
        createdAt: new Date('2026-02-14').toISOString(),
    },
]

function createInitialStore(): StoreData {
    return {
        users: [...SEED_USERS],
        bookings: [...SEED_BOOKINGS],
        applications: [],
        caregiverProfiles: [],
        _nextUserId: 100,
        _nextBookingId: 100,
        _nextAppId: 100,
    }
}

declare global {
    // eslint-disable-next-line no-var
    var __carethia_store: StoreData | undefined
}

function getStore(): StoreData {
    if (!global.__carethia_store) {
        global.__carethia_store = createInitialStore()
    }
    return global.__carethia_store
}

// ─── User helpers ─────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): StoredUser | undefined {
    return getStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: number): StoredUser | undefined {
    return getStore().users.find((u) => u.id === id)
}

export function createUser(data: Omit<StoredUser, 'id' | 'createdAt' | 'points'> & { points?: number }): StoredUser {
    const store = getStore()
    const user: StoredUser = { ...data, points: data.points ?? 0, id: store._nextUserId++, createdAt: new Date().toISOString() }
    store.users.push(user)
    return user
}

/** Award points to a user. Returns new total. */
export function addPoints(userId: number, pts: number): number {
    const user = getStore().users.find(u => u.id === userId)
    if (!user) return 0
    user.points = (user.points ?? 0) + pts
    return user.points
}

export function safeUser(user: StoredUser) {
    const { password: _pw, ...safe } = user
    return safe
}

// ─── Booking helpers ───────────────────────────────────────────────────────────

export function createBooking(data: Omit<StoredBooking, 'id' | 'createdAt'>): StoredBooking {
    const store = getStore()
    const booking: StoredBooking = { ...data, id: store._nextBookingId++, createdAt: new Date().toISOString() }
    store.bookings.push(booking)
    return booking
}

export function getBookingsByCustomer(customerId: number): StoredBooking[] {
    return getStore()
        .bookings.filter((b) => b.customerId === customerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getBookingsByCaregiver(caregiverId: number): StoredBooking[] {
    return getStore()
        .bookings.filter((b) => b.caregiverId === caregiverId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function updateBookingStatus(
    bookingId: number,
    status: StoredBooking['status'],
): StoredBooking | null {
    const store = getStore()
    const booking = store.bookings.find((b) => b.id === bookingId)
    if (!booking) return null
    booking.status = status
    // Award loyalty points on completion
    if (status === 'COMPLETED') {
        addPoints(booking.customerId, 50)   // customer earns 50 pts per completed booking
        addPoints(booking.caregiverId, 100) // caregiver earns 100 pts per completed session
    }
    return booking
}

export function getAllBookings(): StoredBooking[] {
    return getStore().bookings
}

// ─── Application helpers ───────────────────────────────────────────────────────

export function createApplication(data: Omit<StoredApplication, 'id' | 'createdAt'>): StoredApplication {
    const store = getStore()
    const app: StoredApplication = { ...data, id: store._nextAppId++, createdAt: new Date().toISOString() }
    store.applications.push(app)
    return app
}

export function getAllApplications(): StoredApplication[] {
    return getStore().applications
}

// ─── Caregiver Profile helpers ─────────────────────────────────────────────────

export function createCaregiverProfile(
    data: Omit<StoredCaregiverProfile, 'createdAt'>,
): StoredCaregiverProfile {
    const store = getStore()
    // replace if profile for this user already exists
    store.caregiverProfiles = store.caregiverProfiles.filter(
        (p) => p.userId !== data.userId,
    )
    const profile: StoredCaregiverProfile = { ...data, createdAt: new Date().toISOString() }
    store.caregiverProfiles.push(profile)
    return profile
}

export function getAllCaregiverProfiles(): StoredCaregiverProfile[] {
    return getStore().caregiverProfiles
}

export function getCaregiverProfileById(userId: number): StoredCaregiverProfile | undefined {
    return getStore().caregiverProfiles.find((p) => p.userId === userId)
}

export function updateCaregiverProfile(
    userId: number,
    patch: Partial<Omit<StoredCaregiverProfile, 'userId' | 'email' | 'createdAt'>>,
): StoredCaregiverProfile | null {
    const store = getStore()
    const idx = store.caregiverProfiles.findIndex((p) => p.userId === userId)
    if (idx === -1) return null
    store.caregiverProfiles[idx] = {
        ...store.caregiverProfiles[idx],
        ...patch,
        // recalculate primaryService if services array was updated
        primaryService: patch.services?.[0] ?? store.caregiverProfiles[idx].primaryService,
    }
    return store.caregiverProfiles[idx]
}

// ─── Relationship Score ───────────────────────────────────────────────────────

export interface RelationshipScore {
    level: 'New' | 'Familiar' | 'Regular' | 'Trusted'
    bookingCount: number
    score: number   // 0–100
    color: string
    icon: string
}

/** How well a customer knows a caregiver, based on completed bookings together. */
export function getRelationshipScore(customerId: number, caregiverId: number): RelationshipScore {
    const count = getStore().bookings.filter(
        b => b.customerId === customerId && b.caregiverId === caregiverId && b.status === 'COMPLETED',
    ).length
    const score = Math.min(100, count * 20 + (count > 0 ? 10 : 0))
    if (count === 0) return { level: 'New', bookingCount: 0, score: 0, color: '#9E9E9E', icon: '👋' }
    if (count <= 2) return { level: 'Familiar', bookingCount: count, score, color: '#FF8C00', icon: '🤝' }
    if (count <= 5) return { level: 'Regular', bookingCount: count, score, color: '#6C63FF', icon: '💜' }
    return { level: 'Trusted', bookingCount: count, score: 100, color: '#2ECC71', icon: '⭐' }
}



