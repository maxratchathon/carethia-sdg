/**
 * @file Database utilities
 * @description Database helper functions for the API
 */

import { eq } from 'drizzle-orm'
import { db, users, caregivers, bookings } from '@carethia/db'
import type { CaregiverService } from '@carethia/shared'

export class DatabaseService {
    // User queries
    async getUserById(userId: number) {
        return db.query.users.findFirst({
            where: eq(users.id, userId),
        })
    }

    async getUserByEmail(email: string) {
        return db.query.users.findFirst({
            where: eq(users.email, email),
        })
    }

    async createUser(data: {
        email: string
        password: string
        firstName: string
        lastName: string
        phone?: string
        role: 'CUSTOMER' | 'CAREGIVER' | 'ADMIN'
    }) {
        const [user] = await db.insert(users).values(data).returning()
        return user
    }

    // Caregiver queries
    async getCaregivers() {
        let query = db.query.caregivers.findMany({
            with: {
                user: true,
            },
        })

        // Add filtering logic here
        const result = await query
        return result
    }

    async getCaregiverById(caregiverId: number) {
        return db.query.caregivers.findFirst({
            where: eq(caregivers.id, caregiverId),
            with: {
                user: true,
                reviews: true,
            },
        })
    }

    // Booking queries
    async createBooking(data: {
        customerId: number
        caregiverId: number
        serviceType: CaregiverService
        startDate: Date
        endDate: Date
        totalPrice: number
        notes?: string
    }) {
        const [booking] = await db
            .insert(bookings)
            .values({ ...data, totalPrice: String(data.totalPrice) })
            .returning()
        return booking
    }

    async getBookingsByCustomerId(customerId: number) {
        return db.query.bookings.findMany({
            where: eq(bookings.customerId, customerId),
            with: {
                caregiver: {
                    with: {
                        user: true,
                    },
                },
            },
        })
    }
}

export const databaseService = new DatabaseService()
