import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  DATABASE_URL: z.string().default(String(process.env.POSTGRES_URL)),
  PORT: z.coerce.number().default(Number(process.env.BOT_PORT)),
  HOST: z.string().default(String(process.env.BOT_HOST)),
})

export const env = envSchema.parse(process.env)
