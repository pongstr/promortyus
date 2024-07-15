import fastify from 'fastify'

import db, { env, Logger } from '@/db'
import { appMiddleware, jwtMiddleware } from '@/middleware'
import { rootRoute } from '@/routes'
import { botRoute } from '@/routes/bot-route'
import { BOT_ENDPOINT, webhook } from '@/utils'

const PORT = env.PORT ?? 3000
const HOST = 'RENDER' in process.env ? '0.0.0.0' : env.HOST

const main = async () => {
  const server = fastify({ bodyLimit: 1_000_000, trustProxy: true })

  db()
  webhook()

  server.register(import('@fastify/cors'), {
    maxAge: 600,
    origin: true,
    credentials: false,
  })

  server.register(appMiddleware)
  server.register(jwtMiddleware)
  server.register(rootRoute)
  server.register(botRoute, { prefix: BOT_ENDPOINT.pathname })

  server.listen({ host: String(HOST), port: PORT }, (error, address) => {
    if (error) {
      Logger.error('INIT', error.message)
      throw new Error(error.message)
    }

    Logger.info('INIT', `Server listening at ${address}`)
    Logger.info(
      'Env Vars',
      ['', `API URL: ${process.env.BOT_PROD}`, `${process.env.TG_TOKEN}`].join('\n'),
    )
  })

  return server
}

main()
