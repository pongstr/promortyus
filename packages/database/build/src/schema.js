'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.users = void 0
const pg_core_1 = require('drizzle-orm/pg-core')
exports.users = (0, pg_core_1.pgTable)('users', {
  id: (0, pg_core_1.serial)('id').primaryKey(),
  telegramID: (0, pg_core_1.text)('telegram_id').notNull(),
  firstName: (0, pg_core_1.text)('first_name').notNull(),
  lastName: (0, pg_core_1.text)('last_name').notNull(),
  username: (0, pg_core_1.text)('username').notNull().unique(),
  languageCode: (0, pg_core_1.text)('language_code').notNull(),
  createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
  updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
  isAdmin: (0, pg_core_1.boolean)('is_admin'),
  password: (0, pg_core_1.text)('password'),
})
