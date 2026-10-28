import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const config = useRuntimeConfig()
const queryClient = postgres(config.dbUrl)
export const db = drizzle({ client: queryClient })
