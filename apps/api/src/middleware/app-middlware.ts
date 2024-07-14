import { FastifyInstance, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

import db from '@/db'

export const appMiddleware = fp(async (fastify: FastifyInstance) => {
  const admin = String(process.env.ADMIN_LIST)
    .split(', ')
    .map((item) => Number(item))

  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    request.db = db
    request.admin = admin
  })
})
