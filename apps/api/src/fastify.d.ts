import db from '@/db'

declare module 'fastify' {
  export interface FastifyRequest {
    db: typeof db
    sessionId: number
    admin: number[]
  }
}
