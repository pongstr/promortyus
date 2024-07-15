import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import {
  getUser,
  listUsers,
  messageSender,
  registerUser,
  setAdminUser,
  TelegramResponseType,
} from './controller/bot'

async function responseHandler(request: FastifyRequest) {
  const { message } = request.body as unknown as TelegramResponseType

  async function authorizationCheck() {
    await messageSender(
      message.chat.id,
      ["*🤖 Woops! Looks like you're try to access an admin command.\n*"].join('\n'),
      'Markdown',
    )

    messageSender.flush()
  }

  if (message.text.indexOf('/') > -1) {
    const context = message.text.substring(1).split(' ')
    const cmd = context.at(0)

    switch (cmd) {
      // start command
      case 'start':
        await messageSender(
          message.chat.id,
          `👋 Hello, ${message.from.first_name}! how are you today?`,
        )
        messageSender.flush()
        break

      // admin: greeting
      case 'adminhello':
        if (!request.admin.includes(message.from.id)) {
          authorizationCheck()
          return
        }

        await getUser(request, Number(context.at(1)), true, context.slice(2).join(' '))
        break

      // admin: list users
      case 'users':
        if (!request.admin.includes(message.from.id)) {
          authorizationCheck()
          return
        }

        await listUsers(request)
        break

      // admin: get user
      case 'user':
        if (!request.admin.includes(message.from.id)) {
          authorizationCheck()
          return
        }

        await getUser(request, Number(context.at(1)))
        break

      // set user as admin
      case 'sudo': {
        const _cmd = context.slice(0, 3).join(' ')
        const _prm = context.slice(3).map((i) => Number(i))

        if (/(sudo usermod -aG)/.test(_cmd) && _prm.length === 2) {
          await setAdminUser(request, [Number(_prm[0]), Number(_prm[1])])
          return
        }

        break
      }

      case 'help': {
        await messageSender(
          message.chat.id,
          [
            "*🤖 Here's a list the available admin commands\n*",
            '• /adminhello `<TELEGRAM_ID> message`',
            '• /users lists the users of the bot.',
            '• /user `<TELEGRAM_ID>`',
            // TODO:
            // we should also query admins from the db and push them here so that newly
            // created admin can actually use the admin comands
            '• /sudo usermod -aG `<TELEGRAM_ID>` `<PASSCODE>` will set yourself as admin.',
          ].join('\n'),
          'Markdown',
        )

        messageSender.flush()
        break
      }

      default:
        break
    }
  }
}

// bot endpoint
export const botRoute = (fastify: FastifyInstance, _: unknown, done: () => void) => {
  fastify.post('/', async (request: FastifyRequest, response: FastifyReply) => {
    if (request.body && !Reflect.has(request.body, 'message')) {
      return response.status(400).send({
        code: 400,
        message: 'Missing required parameters, please try again.',
      })
    }

    try {
      await registerUser(request)
      await responseHandler(request)
      response.code(200).send({ message: 'gucci!' })
    } catch (err: unknown) {
      response.code(500).send({ message: 'shite!' })
    }
  })

  done()
}
