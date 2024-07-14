'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const drizzle_kit_1 = require('drizzle-kit')
exports.default = (0, drizzle_kit_1.defineConfig)({
  schema: './schema/*',
  out: './.drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
})
