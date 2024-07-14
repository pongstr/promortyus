import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

export const jwtMiddleware = fp<FastifyJWTOptions>(
  async (fastify: FastifyInstance) => {
    fastify.register(fastifyJwt, {
      secret: process.env.COOKIE_SECRET! as string,
    })

    fastify.decorate(
      'authenticate',
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.send(err)
        }
      },
    )
  },
)
