'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.env = void 0
const zod_1 = require('zod')
require('dotenv/config')
const envSchema = zod_1.z.object({
  DATABASE_URL: zod_1.z.string().default(String(process.env.POSTGRES_URL)),
  PORT: zod_1.z.coerce.number().default(Number(process.env.BOT_PORT)),
  HOST: zod_1.z.string().default(String(process.env.BOT_HOST)),
})
exports.env = envSchema.parse(process.env)
