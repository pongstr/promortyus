import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { UserModel, UserModelType, users } from '@/db'

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

  fastify.post(
    '/api/signup',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { telegramID, password } = request.body as Pick<
        UserModelType,
        'telegramID'
      > & {
        password: string
      }

      const user = await request.db().query.users.findFirst({
        // @ts-ignore https://github.com/drizzle-team/drizzle-orm/pull/1792
        where: (users, { eq }) => eq(users.telegramID, telegramID),
      })

      // TODO:
      // since web and bot are sharing db table, if a telegramID already exists
      // in the database but has no password, we'll just update the model with
      // the addition of the password provided
      if (user && !user.password) {
        const hashed = await bcrypt.hash(password, 10)

        await request
          .db()
          .update(users)
          .set({ password: hashed })
          // @ts-ignore https://github.com/drizzle-team/drizzle-orm/pull/1792
          .where(eq(users.id, user.id))
          .returning()

        const token = fastify.jwt.sign(user)
        response
          .status(200)
          .send({ code: 200, message: 'Authenticated', token })
        return
      }

      if (user && user.password) {
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          response.status(401).send({
            status: 401,
            message:
              "The password you've entered is incorrect. Please try again.",
          })
          return
        }

        const token = fastify.jwt.sign(user)
        response
          .status(200)
          .send({ code: 200, message: 'Authenticated', token })
        return
      }

      try {
        const hashed = await bcrypt.hash(password, 10)
        const created = await request
          .db()
          .insert(users)
          .values(
            // TODO: empty values might cause an error when the user signs up
            // before it subscribes to the bot, make sure to add a mechanism
            // in the bot.registerUser() to update these values when they
            // decide to subscribe
            UserModel.parse({
              username: '',
              firstName: '',
              lastName: '',
              languageCode: 'en',
              telegramID: String(telegramID),
              password: hashed,
              createdAt: new Date(),
              updatedAt: new Date(),
              isAdmin: false,
            }),
          )
          .returning()

        const token = fastify.jwt.sign(created)
        response
          .status(200)
          .send({ code: 200, message: 'Authenticated', token })
      } catch (err: unknown) {
        const message = (err as Error).message
        // TODO: in cases where error message is  non-parsable to json
        // this will def fail, check to improve this later
        response.status(400).send({ code: 400, message: JSON.parse(message) })
      }
    },
  )

  fastify.post(
    '/api/login',
    async (request: FastifyRequest, response: FastifyReply) => {
      const payload = request.body as Pick<UserModelType, 'telegramID'> & {
        password: string
      }

      const hasID = Reflect.has(payload, 'telegramID')
      const hasPW = Reflect.has(payload, 'password')

      if (!hasID && !hasPW) {
        return response.status(400).send({
          code: 400,
          message: [
            'TelegramID is a required field to sign in.',
            'Password is a required field to sign in.',
          ],
        })
      }

      if (!hasID || isNaN(Number(payload.telegramID))) {
        return response.status(400).send({
          code: 400,
          message: 'TelegramID is a required field to sign in.',
        })
      }

      if (!hasPW || payload.password.trim() === '') {
        return response.status(400).send({
          code: 400,
          message: 'Password is a required field to sign in.',
        })
      }

      const user = await request.db().query.users.findFirst({
        // @ts-ignore https://github.com/drizzle-team/drizzle-orm/pull/1792
        where: (users, { eq }) => eq(users.telegramID, payload.telegramID),
      })

      if (!user || !user.password) {
        return response.status(400).send({
          code: 401,
          message: 'The Telegram ID you entered does not exists.',
        })
      }

      const isPasswordValid = await bcrypt.compare(
        payload.password,
        user.password,
      )

      if (!isPasswordValid) {
        response.status(401).send({
          status: 401,
          message:
            "The password you've entered is incorrect. Please try again.",
        })
        return
      }

      const token = fastify.jwt.sign(user)
      response.status(200).send({ code: 200, message: 'Authenticated', token })
    },
  )

  done()
}
