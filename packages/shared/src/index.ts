// Common types shared between frontend and backend

export type UserRole = 'CUSTOMER' | 'CAREGIVER' | 'ADMIN'

export type CaregiverService =
    | 'ELDERLY_CAREGIVER'
    | 'SPECIAL_NEEDS_TRAINER'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED'

export interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    phone?: string
    avatar?: string
    role: UserRole
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface Customer extends User {
    role: 'CUSTOMER'
    address?: string
    city?: string
    state?: string
    zipCode?: string
    preferences?: Record<string, any>
}

export interface Caregiver extends User {
    role: 'CAREGIVER'
    bio?: string
    services: CaregiverService[]
    experience?: number
    hourlyRate?: number
    certifications?: string[]
    backgroundCheckStatus: VerificationStatus
    skillVerification: VerificationStatus
    safetyScore: number
    overallRating: number
    reviewCount: number
    isAvailable: boolean
}

export interface Booking {
    id: number
    customerId: number
    caregiverId: number
    serviceType: CaregiverService
    startDate: Date
    endDate: Date
    status: BookingStatus
    notes?: string
    totalPrice: number
    createdAt: Date
    updatedAt: Date
}

export interface Review {
    id: number
    bookingId: number
    customerId: number
    caregiverId: number
    rating: number
    comment?: string
    createdAt: Date
}

export interface Subscription {
    id: number
    customerId: number
    caregiverId: number
    serviceType: CaregiverService
    frequency: 'weekly' | 'bi-weekly' | 'monthly'
    price: number
    isActive: boolean
    startDate: Date
    endDate?: Date
    createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}
