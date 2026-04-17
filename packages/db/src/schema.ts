import { pgTable, serial, varchar, text, timestamp, boolean, decimal, pgEnum, integer, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['CUSTOMER', 'CAREGIVER', 'ADMIN'])
export const caregiverServiceEnum = pgEnum('caregiver_service', ['ELDERLY_CAREGIVER', 'SPECIAL_NEEDS_TRAINER'])
export const bookingStatusEnum = pgEnum('booking_status', ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
export const verificationStatusEnum = pgEnum('verification_status', ['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'])
export const membershipPlanEnum = pgEnum('membership_plan', ['BASIC', 'PREMIUM', 'CORPORATE'])

// Users table
export const users = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        email: varchar('email', { length: 255 }).notNull().unique(),
        password: varchar('password', { length: 255 }).notNull(),
        firstName: varchar('first_name', { length: 100 }).notNull(),
        lastName: varchar('last_name', { length: 100 }).notNull(),
        phone: varchar('phone', { length: 20 }),
        avatar: text('avatar'),
        role: userRoleEnum('role').notNull().default('CUSTOMER'),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => {
        return {
            emailIdx: index('email_idx').on(table.email),
            roleIdx: index('role_idx').on(table.role),
        }
    },
)

// Customer profiles
export const customers = pgTable('customers', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique().references(() => users.id),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    zipCode: varchar('zip_code', { length: 20 }),
    preferences: text('preferences'), // JSON
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Caregiver profiles
export const caregivers = pgTable(
    'caregivers',
    {
        id: serial('id').primaryKey(),
        userId: integer('user_id').notNull().unique().references(() => users.id),
        bio: text('bio'),
        services: caregiverServiceEnum('services').array(),
        experience: integer('experience'), // years
        hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
        certifications: text('certifications'), // JSON array
        backgroundCheckStatus: verificationStatusEnum('background_check_status').notNull().default('PENDING'),
        backgroundCheckDate: timestamp('background_check_date', { withTimezone: true }),
        skillVerification: verificationStatusEnum('skill_verification').notNull().default('PENDING'),
        safetyScore: decimal('safety_score', { precision: 3, scale: 2 }).default('0.00'),
        overallRating: decimal('overall_rating', { precision: 3, scale: 2 }).default('0.00'),
        reviewCount: integer('review_count').default(0),
        isAvailable: boolean('is_available').notNull().default(true),
        languagesSpoken: text('languages_spoken').array(),
        careTrustScore: decimal('care_trust_score', { precision: 5, scale: 2 }).default('0.00'),
        city: varchar('city', { length: 100 }),
        district: varchar('district', { length: 100 }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => {
        return {
            userIdIdx: index('caregiver_user_id_idx').on(table.userId),
            backgroundCheckIdx: index('background_check_idx').on(table.backgroundCheckStatus),
            availabilityIdx: index('availability_idx').on(table.isAvailable),
        }
    },
)

// Bookings
export const bookings = pgTable(
    'bookings',
    {
        id: serial('id').primaryKey(),
        customerId: integer('customer_id').notNull().references(() => customers.id),
        caregiverId: integer('caregiver_id').notNull().references(() => caregivers.id),
        serviceType: caregiverServiceEnum('service_type').notNull(),
        startDate: timestamp('start_date', { withTimezone: true }).notNull(),
        endDate: timestamp('end_date', { withTimezone: true }).notNull(),
        status: bookingStatusEnum('status').notNull().default('PENDING'),
        notes: text('notes'),
        isEmergency: boolean('is_emergency').notNull().default(false),
        checkIn: timestamp('check_in', { withTimezone: true }),
        checkOut: timestamp('check_out', { withTimezone: true }),
        totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => {
        return {
            customerIdIdx: index('booking_customer_id_idx').on(table.customerId),
            caregiverIdIdx: index('booking_caregiver_id_idx').on(table.caregiverId),
            statusIdx: index('booking_status_idx').on(table.status),
            startDateIdx: index('booking_start_date_idx').on(table.startDate),
        }
    },
)

// Reviews and ratings
export const reviews = pgTable(
    'reviews',
    {
        id: serial('id').primaryKey(),
        bookingId: integer('booking_id').notNull().unique().references(() => bookings.id),
        customerId: integer('customer_id').notNull().references(() => customers.id),
        caregiverId: integer('caregiver_id').notNull().references(() => caregivers.id),
        rating: integer('rating').notNull(), // 1-5
        comment: text('comment'),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => {
        return {
            bookingIdIdx: index('review_booking_id_idx').on(table.bookingId),
            caregiverIdIdx: index('review_caregiver_id_idx').on(table.caregiverId),
        }
    },
)

// Subscriptions for recurring services
export const subscriptions = pgTable(
    'subscriptions',
    {
        id: serial('id').primaryKey(),
        customerId: integer('customer_id').notNull().references(() => customers.id),
        caregiverId: integer('caregiver_id').notNull().references(() => caregivers.id),
        serviceType: caregiverServiceEnum('service_type').notNull(),
        frequency: varchar('frequency', { length: 50 }).notNull(), // weekly, bi-weekly, monthly
        price: decimal('price', { precision: 10, scale: 2 }).notNull(),
        isActive: boolean('is_active').notNull().default(true),
        startDate: timestamp('start_date', { withTimezone: true }).notNull(),
        endDate: timestamp('end_date', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => {
        return {
            customerIdIdx: index('subscription_customer_id_idx').on(table.customerId),
            caregiverIdIdx: index('subscription_caregiver_id_idx').on(table.caregiverId),
        }
    },
)

// Premium memberships
export const memberships = pgTable(
    'memberships',
    {
        id: serial('id').primaryKey(),
        customerId: integer('customer_id').notNull().references(() => customers.id),
        planType: membershipPlanEnum('plan_type').notNull().default('BASIC'),
        price: decimal('price', { precision: 10, scale: 2 }).notNull(),
        isActive: boolean('is_active').notNull().default(true),
        startDate: timestamp('start_date', { withTimezone: true }).notNull(),
        endDate: timestamp('end_date', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => {
        return {
            customerIdIdx: index('membership_customer_id_idx').on(table.customerId),
        }
    },
)

// Care progress reports (for parents' care dashboard)
export const careReports = pgTable(
    'care_reports',
    {
        id: serial('id').primaryKey(),
        bookingId: integer('booking_id').notNull().references(() => bookings.id),
        caregiverId: integer('caregiver_id').notNull().references(() => caregivers.id),
        customerId: integer('customer_id').notNull().references(() => customers.id),
        progressNotes: text('progress_notes'),
        metrics: text('metrics'), // JSON: { mood, activities, meals, milestones }
        photoUrls: text('photo_urls').array(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => {
        return {
            bookingIdIdx: index('care_report_booking_id_idx').on(table.bookingId),
            caregiverIdIdx: index('care_report_caregiver_id_idx').on(table.caregiverId),
        }
    },
)

// Relations
export const usersRelations = relations(users, ({ one }) => ({
    customer: one(customers, {
        fields: [users.id],
        references: [customers.userId],
    }),
    caregiver: one(caregivers, {
        fields: [users.id],
        references: [caregivers.userId],
    }),
}))

export const customersRelations = relations(customers, ({ one, many }) => ({
    user: one(users, {
        fields: [customers.userId],
        references: [users.id],
    }),
    bookings: many(bookings),
    subscriptions: many(subscriptions),
    reviews: many(reviews),
    memberships: many(memberships),
    careReports: many(careReports),
}))

export const caregiversRelations = relations(caregivers, ({ one, many }) => ({
    user: one(users, {
        fields: [caregivers.userId],
        references: [users.id],
    }),
    bookings: many(bookings),
    subscriptions: many(subscriptions),
    reviews: many(reviews),
    careReports: many(careReports),
}))

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
    customer: one(customers, {
        fields: [bookings.customerId],
        references: [customers.id],
    }),
    caregiver: one(caregivers, {
        fields: [bookings.caregiverId],
        references: [caregivers.id],
    }),
    reviews: many(reviews),
    careReport: one(careReports, {
        fields: [bookings.id],
        references: [careReports.bookingId],
    }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
    booking: one(bookings, {
        fields: [reviews.bookingId],
        references: [bookings.id],
    }),
    customer: one(customers, {
        fields: [reviews.customerId],
        references: [customers.id],
    }),
    caregiver: one(caregivers, {
        fields: [reviews.caregiverId],
        references: [caregivers.id],
    }),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
    customer: one(customers, {
        fields: [subscriptions.customerId],
        references: [customers.id],
    }),
    caregiver: one(caregivers, {
        fields: [subscriptions.caregiverId],
        references: [caregivers.id],
    }),
}))

export const membershipsRelations = relations(memberships, ({ one }) => ({
    customer: one(customers, {
        fields: [memberships.customerId],
        references: [customers.id],
    }),
}))

export const careReportsRelations = relations(careReports, ({ one }) => ({
    booking: one(bookings, {
        fields: [careReports.bookingId],
        references: [bookings.id],
    }),
    caregiver: one(caregivers, {
        fields: [careReports.caregiverId],
        references: [caregivers.id],
    }),
    customer: one(customers, {
        fields: [careReports.customerId],
        references: [customers.id],
    }),
}))
