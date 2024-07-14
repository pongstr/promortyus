import fastify from 'fastify'

import db, { env } from '@/db'
import { rootRoute } from '@/routes/root'

const PORT = env.PORT ?? 3000
const HOST = 'RENDER' in process.env ? '0.0.0.0' : env.HOST

const main = async () => {
  const server = fastify({ bodyLimit: 1_000_000, trustProxy: true })

  db()

  server.register(import('@fastify/cors'), {
    maxAge: 600,
    origin: true,
    credentials: true,
  })

  server.register(rootRoute)
  server.listen({ host: String(HOST), port: PORT }, (error, address) => {
    if (error) {
      console.error('INIT', error.message)
      throw new Error(error.message)
    }

    console.info('INIT', `Server listening at ${address}`)
  })

  return server
}

main()
