import { sql } from '@vercel/postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { resolve } from 'path'

import * as schema from './schema'
import { Logger } from './utils'

const migrationsFolder = resolve(__dirname, 'migrations')

export const setupMigrate = async (): Promise<void> => {
  const db: ReturnType<typeof drizzle<typeof schema>> = drizzle(sql, {
    schema,
  })

  await migrate(db, { migrationsFolder })
    .then(() => Logger.info('INIT', 'Migrated database'))
    .catch((error) => {
      console.log(JSON.stringify(error))
      Logger.error('INIT', `Failed to migrate database ${String(error)}`)
      throw new Error(`Failed to migrate database ${String(error)}`)
    })
}
