import { Config, defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './schema/*',
  out: './.drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
} as Config)
