import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

export let DatabaseType: ReturnType<typeof drizzle<typeof schema>>

export default function db(): typeof DatabaseType {
  return drizzle(sql, { schema })
}

export * from './validators/user.validator'
export * from './setup'
export * from './schema'
export * from './utils'
