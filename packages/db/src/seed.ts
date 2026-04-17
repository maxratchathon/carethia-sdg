import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users, customers, caregivers } from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
}

const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql)

async function seed() {
    try {
        console.log('🌱 Seeding database...')

        // Create sample users
        const sampleUsers = [
            {
                email: 'customer@example.com',
                password: 'hashed_password', // In production, this would be properly hashed
                firstName: 'Sarah',
                lastName: 'Johnson',
                phone: '+1-555-0123',
                role: 'CUSTOMER' as const,
            },
            {
                email: 'caregiver@example.com',
                password: 'hashed_password',
                firstName: 'Maria',
                lastName: 'Garcia',
                phone: '+1-555-0456',
                role: 'CAREGIVER' as const,
            },
        ]

        console.log('✅ Sample data prepared (implement actual seeding as needed)')
    } catch (error) {
        console.error('❌ Seeding failed:', error)
        throw error
    } finally {
        await sql.end()
    }
}

seed()
