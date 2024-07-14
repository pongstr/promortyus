import type { FastifyInstance, FastifyReply } from 'fastify'

export const rootRoute = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.get('/', async (_, response: FastifyReply) => {
    response.code(200).send({
      status: 200,
      message: 'Hello! 👋',
      timestamp: new Date().getTime(),
    })
  })

  done()
}
