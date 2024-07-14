import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'

import * as schema from './schema'

export * from './schema'
export * from './setup'
export * from './utils'
export * from './validators/user.validator'

export let DatabaseType: ReturnType<typeof drizzle<typeof schema>>
export default function db(): typeof DatabaseType {
  return drizzle(sql, { schema })
}
