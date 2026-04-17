import 'dotenv/config'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
}

const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql)

async function main() {
    try {
        console.log('Running migrations...')
        await migrate(db, { migrationsFolder: './drizzle' })
        console.log('✅ Migrations completed successfully')
    } catch (error) {
        console.error('❌ Migration failed:', error)
        throw error
    } finally {
        await sql.end()
    }
}

main()
