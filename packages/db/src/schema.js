"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careReportsRelations = exports.membershipsRelations = exports.subscriptionsRelations = exports.reviewsRelations = exports.bookingsRelations = exports.caregiversRelations = exports.customersRelations = exports.usersRelations = exports.careReports = exports.memberships = exports.subscriptions = exports.reviews = exports.bookings = exports.caregivers = exports.customers = exports.users = exports.membershipPlanEnum = exports.verificationStatusEnum = exports.bookingStatusEnum = exports.caregiverServiceEnum = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Enums
exports.userRoleEnum = (0, pg_core_1.pgEnum)('user_role', ['CUSTOMER', 'CAREGIVER', 'ADMIN']);
exports.caregiverServiceEnum = (0, pg_core_1.pgEnum)('caregiver_service', ['ELDERLY_CAREGIVER', 'SPECIAL_NEEDS_TRAINER']);
exports.bookingStatusEnum = (0, pg_core_1.pgEnum)('booking_status', ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);
exports.verificationStatusEnum = (0, pg_core_1.pgEnum)('verification_status', ['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']);
exports.membershipPlanEnum = (0, pg_core_1.pgEnum)('membership_plan', ['BASIC', 'PREMIUM', 'CORPORATE']);
// Users table
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    avatar: (0, pg_core_1.text)('avatar'),
    role: (0, exports.userRoleEnum)('role').notNull().default('CUSTOMER'),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
    return {
        emailIdx: (0, pg_core_1.index)('email_idx').on(table.email),
        roleIdx: (0, pg_core_1.index)('role_idx').on(table.role),
    };
});
// Customer profiles
exports.customers = (0, pg_core_1.pgTable)('customers', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').notNull().unique().references(() => exports.users.id),
    address: (0, pg_core_1.text)('address'),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 100 }),
    zipCode: (0, pg_core_1.varchar)('zip_code', { length: 20 }),
    preferences: (0, pg_core_1.text)('preferences'), // JSON
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
});
// Caregiver profiles
exports.caregivers = (0, pg_core_1.pgTable)('caregivers', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').notNull().unique().references(() => exports.users.id),
    bio: (0, pg_core_1.text)('bio'),
    services: (0, exports.caregiverServiceEnum)('services').array(),
    experience: (0, pg_core_1.integer)('experience'), // years
    hourlyRate: (0, pg_core_1.decimal)('hourly_rate', { precision: 10, scale: 2 }),
    certifications: (0, pg_core_1.text)('certifications'), // JSON array
    backgroundCheckStatus: (0, exports.verificationStatusEnum)('background_check_status').notNull().default('PENDING'),
    backgroundCheckDate: (0, pg_core_1.timestamp)('background_check_date', { withTimezone: true }),
    skillVerification: (0, exports.verificationStatusEnum)('skill_verification').notNull().default('PENDING'),
    safetyScore: (0, pg_core_1.decimal)('safety_score', { precision: 3, scale: 2 }).default('0.00'),
    overallRating: (0, pg_core_1.decimal)('overall_rating', { precision: 3, scale: 2 }).default('0.00'),
    reviewCount: (0, pg_core_1.integer)('review_count').default(0),
    isAvailable: (0, pg_core_1.boolean)('is_available').notNull().default(true),
    languagesSpoken: (0, pg_core_1.text)('languages_spoken').array(),
    careTrustScore: (0, pg_core_1.decimal)('care_trust_score', { precision: 5, scale: 2 }).default('0.00'),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    district: (0, pg_core_1.varchar)('district', { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
    return {
        userIdIdx: (0, pg_core_1.index)('caregiver_user_id_idx').on(table.userId),
        backgroundCheckIdx: (0, pg_core_1.index)('background_check_idx').on(table.backgroundCheckStatus),
        availabilityIdx: (0, pg_core_1.index)('availability_idx').on(table.isAvailable),
    };
});
// Bookings
exports.bookings = (0, pg_core_1.pgTable)('bookings', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').notNull().references(() => exports.customers.id),
    caregiverId: (0, pg_core_1.integer)('caregiver_id').notNull().references(() => exports.caregivers.id),
    serviceType: (0, exports.caregiverServiceEnum)('service_type').notNull(),
    startDate: (0, pg_core_1.timestamp)('start_date', { withTimezone: true }).notNull(),
    endDate: (0, pg_core_1.timestamp)('end_date', { withTimezone: true }).notNull(),
    status: (0, exports.bookingStatusEnum)('status').notNull().default('PENDING'),
    notes: (0, pg_core_1.text)('notes'),
    isEmergency: (0, pg_core_1.boolean)('is_emergency').notNull().default(false),
    checkIn: (0, pg_core_1.timestamp)('check_in', { withTimezone: true }),
    checkOut: (0, pg_core_1.timestamp)('check_out', { withTimezone: true }),
    totalPrice: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
    return {
        customerIdIdx: (0, pg_core_1.index)('booking_customer_id_idx').on(table.customerId),
        caregiverIdIdx: (0, pg_core_1.index)('booking_caregiver_id_idx').on(table.caregiverId),
        statusIdx: (0, pg_core_1.index)('booking_status_idx').on(table.status),
        startDateIdx: (0, pg_core_1.index)('booking_start_date_idx').on(table.startDate),
    };
});
// Reviews and ratings
exports.reviews = (0, pg_core_1.pgTable)('reviews', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    bookingId: (0, pg_core_1.integer)('booking_id').notNull().unique().references(() => exports.bookings.id),
    customerId: (0, pg_core_1.integer)('customer_id').notNull().references(() => exports.customers.id),
    caregiverId: (0, pg_core_1.integer)('caregiver_id').notNull().references(() => exports.caregivers.id),
    rating: (0, pg_core_1.integer)('rating').notNull(), // 1-5
    comment: (0, pg_core_1.text)('comment'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
    return {
        bookingIdIdx: (0, pg_core_1.index)('review_booking_id_idx').on(table.bookingId),
        caregiverIdIdx: (0, pg_core_1.index)('review_caregiver_id_idx').on(table.caregiverId),
    };
});
// Subscriptions for recurring services
exports.subscriptions = (0, pg_core_1.pgTable)('subscriptions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').notNull().references(() => exports.customers.id),
    caregiverId: (0, pg_core_1.integer)('caregiver_id').notNull().references(() => exports.caregivers.id),
    serviceType: (0, exports.caregiverServiceEnum)('service_type').notNull(),
    frequency: (0, pg_core_1.varchar)('frequency', { length: 50 }).notNull(), // weekly, bi-weekly, monthly
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    startDate: (0, pg_core_1.timestamp)('start_date', { withTimezone: true }).notNull(),
    endDate: (0, pg_core_1.timestamp)('end_date', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
    return {
        customerIdIdx: (0, pg_core_1.index)('subscription_customer_id_idx').on(table.customerId),
        caregiverIdIdx: (0, pg_core_1.index)('subscription_caregiver_id_idx').on(table.caregiverId),
    };
});
// Premium memberships
exports.memberships = (0, pg_core_1.pgTable)('memberships', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').notNull().references(() => exports.customers.id),
    planType: (0, exports.membershipPlanEnum)('plan_type').notNull().default('BASIC'),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    startDate: (0, pg_core_1.timestamp)('start_date', { withTimezone: true }).notNull(),
    endDate: (0, pg_core_1.timestamp)('end_date', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
    return {
        customerIdIdx: (0, pg_core_1.index)('membership_customer_id_idx').on(table.customerId),
    };
});
// Care progress reports (for parents' care dashboard)
exports.careReports = (0, pg_core_1.pgTable)('care_reports', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    bookingId: (0, pg_core_1.integer)('booking_id').notNull().references(() => exports.bookings.id),
    caregiverId: (0, pg_core_1.integer)('caregiver_id').notNull().references(() => exports.caregivers.id),
    customerId: (0, pg_core_1.integer)('customer_id').notNull().references(() => exports.customers.id),
    progressNotes: (0, pg_core_1.text)('progress_notes'),
    metrics: (0, pg_core_1.text)('metrics'), // JSON: { mood, activities, meals, milestones }
    photoUrls: (0, pg_core_1.text)('photo_urls').array(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
    return {
        bookingIdIdx: (0, pg_core_1.index)('care_report_booking_id_idx').on(table.bookingId),
        caregiverIdIdx: (0, pg_core_1.index)('care_report_caregiver_id_idx').on(table.caregiverId),
    };
});
// Relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one }) => ({
    customer: one(exports.customers, {
        fields: [exports.users.id],
        references: [exports.customers.userId],
    }),
    caregiver: one(exports.caregivers, {
        fields: [exports.users.id],
        references: [exports.caregivers.userId],
    }),
}));
exports.customersRelations = (0, drizzle_orm_1.relations)(exports.customers, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.customers.userId],
        references: [exports.users.id],
    }),
    bookings: many(exports.bookings),
    subscriptions: many(exports.subscriptions),
    reviews: many(exports.reviews),
    memberships: many(exports.memberships),
    careReports: many(exports.careReports),
}));
exports.caregiversRelations = (0, drizzle_orm_1.relations)(exports.caregivers, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.caregivers.userId],
        references: [exports.users.id],
    }),
    bookings: many(exports.bookings),
    subscriptions: many(exports.subscriptions),
    reviews: many(exports.reviews),
    careReports: many(exports.careReports),
}));
exports.bookingsRelations = (0, drizzle_orm_1.relations)(exports.bookings, ({ one, many }) => ({
    customer: one(exports.customers, {
        fields: [exports.bookings.customerId],
        references: [exports.customers.id],
    }),
    caregiver: one(exports.caregivers, {
        fields: [exports.bookings.caregiverId],
        references: [exports.caregivers.id],
    }),
    reviews: many(exports.reviews),
    careReport: one(exports.careReports, {
        fields: [exports.bookings.id],
        references: [exports.careReports.bookingId],
    }),
}));
exports.reviewsRelations = (0, drizzle_orm_1.relations)(exports.reviews, ({ one }) => ({
    booking: one(exports.bookings, {
        fields: [exports.reviews.bookingId],
        references: [exports.bookings.id],
    }),
    customer: one(exports.customers, {
        fields: [exports.reviews.customerId],
        references: [exports.customers.id],
    }),
    caregiver: one(exports.caregivers, {
        fields: [exports.reviews.caregiverId],
        references: [exports.caregivers.id],
    }),
}));
exports.subscriptionsRelations = (0, drizzle_orm_1.relations)(exports.subscriptions, ({ one }) => ({
    customer: one(exports.customers, {
        fields: [exports.subscriptions.customerId],
        references: [exports.customers.id],
    }),
    caregiver: one(exports.caregivers, {
        fields: [exports.subscriptions.caregiverId],
        references: [exports.caregivers.id],
    }),
}));
exports.membershipsRelations = (0, drizzle_orm_1.relations)(exports.memberships, ({ one }) => ({
    customer: one(exports.customers, {
        fields: [exports.memberships.customerId],
        references: [exports.customers.id],
    }),
}));
exports.careReportsRelations = (0, drizzle_orm_1.relations)(exports.careReports, ({ one }) => ({
    booking: one(exports.bookings, {
        fields: [exports.careReports.bookingId],
        references: [exports.bookings.id],
    }),
    caregiver: one(exports.caregivers, {
        fields: [exports.careReports.caregiverId],
        references: [exports.caregivers.id],
    }),
    customer: one(exports.customers, {
        fields: [exports.careReports.customerId],
        references: [exports.customers.id],
    }),
}));
//# sourceMappingURL=schema.js.map