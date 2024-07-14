import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from 'debounce'
import { eq } from 'drizzle-orm'
import type { FastifyRequest } from 'fastify'

import { Logger, UserModel, users } from '@/db'
import { TGR_ENDPOINT } from '@/utils'

export type TelegramUserType = {
  id: number
  first_name: string
  last_name: string
  username: string
  language_code: string
}

export type TelegramChatType = Omit<TelegramUserType, 'language_code'> & {
  type: 'private' | 'public'
}

export type TelegramEntityType = {
  offset: number
  length: number
  type: string
}

export type TelegramResponseType = {
  update_id: number
  message: {
    message_id: number
    from: TelegramUserType
    chat: TelegramChatType
    date: number
    text: string
    entities: Array<TelegramEntityType>
  }
}

dayjs.extend(relativeTime)

const dateFromNow = (date: Date | number | string): string =>
  dayjs(date).fromNow().toString()

// #== bot actions
//

//#== send message utility
export async function sendMessage(
  chatId: number,
  text: string,
  parse_mode?: string,
) {
  const url = new URL(TGR_ENDPOINT)

  url.pathname = [url.pathname, 'sendMessage'].join('/')

  try {
    Object.entries({
      chat_id: chatId,
      text,
    }).forEach(([key, value]) => url.searchParams.set(key, String(value)))

    if (parse_mode) {
      url.searchParams.set('parse_mode', parse_mode)
    }

    const send = await fetch(url.href, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })

    if (!send.ok) {
      const message = send.statusText
      Logger.error('BotMessageSender', ['Failed', message].join('/'))
      throw Error(message)
    }

    Logger.info(
      'BotMessageSender',
      ['Success', send.status, send.statusText].join('/'),
    )
    return await send.json()
  } catch (err: unknown) {
    const message = (err as Error).message
    Logger.error('BotMessageSender', ['Failed', message].join('/'))
  }
}

// INFO:
// debounce sending message, in cases where the app runs into any issues and sending
// messages gets clogged up in the queue, debouncing allows time between sending
// message to telegram and avoid 429 error
export const messageSender = debounce(sendMessage, 800)

// #== register user action
export async function registerUser(request: FastifyRequest) {
  const { db, body } = request
  const { message } = body as unknown as TelegramResponseType

  if (request.sessionId === message.from.id) {
    Logger.info(
      'BotRegisterUser',
      [message.from.id, 'is a returning User'].join(' '),
    )
    return {
      type: 'success',
      message: 'User is returning',
    }
  }

  try {
    const userExists = await db()
      .select()
      .from(users)
      // @ts-ignore https://github.com/drizzle-team/drizzle-orm/pull/1792
      .where(eq(users.telegramID, Number(message.from.id)))

    if (userExists.length === 0) {
      const { id, first_name, last_name, username, language_code } =
        message.from
      const isAdmin = Boolean(request.admin.includes(message.from.id))
      const content: typeof users.$inferInsert = UserModel.parse({
        username: username ?? first_name,
        telegramID: String(id),
        firstName: first_name,
        lastName: last_name,
        languageCode: language_code,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin,
      })

      const created = await db().insert(users).values(content).returning()
      request.sessionId = id

      Logger.info(
        'BotRegisterUser',
        ['Successfully registered user', id].join(' '),
      )
      return {
        type: 'successs',
        message: 'New user has been added',
        content: created,
      }
    }

    Logger.info('BotRegisterUser', 'Returning User')
    return {
      type: 'success',
      message: 'User is returning',
    }
  } catch (err: unknown) {
    const errorMessage = (err as Error).message
    Logger.error(
      'BotRegisterUser',
      ['Failed to register user:', message.from.id, errorMessage].join(' '),
    )
    return {
      type: 'failed',
      message,
    }
  }
}

// #== list user action
export async function listUsers(request: FastifyRequest) {
  const { db } = request
  const { message } = request.body as unknown as TelegramResponseType

  try {
    const collection = await db().select().from(users).limit(100)
    const userList = collection.map(
      ({ username, createdAt, telegramID, isAdmin }) =>
        [
          `\n\`${telegramID}\` *${username}* ${isAdmin ? '(admin)' : '(member)'}\n`,
          `Joined ${dateFromNow(createdAt.getTime())}\n`,
          '---\n',
        ].join(''),
    )

    const adminCount = collection.filter(({ isAdmin }) => isAdmin).length
    const memberCount = collection.filter(({ isAdmin }) => !isAdmin).length
    const stats = [
      "Here's a list; there are",
      `${collection.length} total users,  ${adminCount} admin${adminCount > 1 ? 's' : ''} and`,
      `${memberCount} member${memberCount > 1 ? 's' : ''}\n`,
    ].join(' ')

    await messageSender(
      message.chat.id,
      [...stats, ...userList].join(''),
      'Markdown',
    )
  } catch (err: unknown) {
    const errorMessage = (err as Error).message
    Logger.error(
      'BotListUsers',
      ['Failed to list users:', errorMessage].join(' '),
    )
    throw new Error(errorMessage)
  }
}

// #== get user action
export async function getUser(
  request: FastifyRequest,
  userId: number,
  greet?: boolean,
  text?: string,
) {
  const { db } = request
  const { message } = request.body as unknown as TelegramResponseType

  try {
    const user = await db()
      .select()
      .from(users)
      // @ts-ignore https://github.com/drizzle-team/drizzle-orm/pull/1792
      .where(eq(users.telegramID, userId))

    if (user.length === 0) {
      Logger.info('BotGetUser', ["Can't find user with id:", userId].join(' '))
      return
    }

    const found = UserModel.parse(user[0])

    if (greet) {
      await messageSender(
        userId,
        [
          `👋 hey [${found.firstName}](tg://user?id=${found.telegramID})! **Admin** says: ${text ?? 'Hello!'}`,
        ].join(' '),
        'Markdown',
      )

      messageSender.flush()
      return
    }

    await messageSender(
      message.chat.id,
      [
        '✅ Found User',
        `\n\`${found.telegramID}\` *${found.username}* ${found.isAdmin ? '(admin)' : '(member)'}`,
        `Joined ${dateFromNow(found.createdAt.getTime())}`,
        '---',
      ].join('\n'),
      'Markdown',
    )
    messageSender.flush()
    return
  } catch (err: unknown) {
    Logger.info('BotGetUser', ['Error', (err as Error).message].join(' '))
  }
}

// #== action to set a standard member to admin
export async function setAdminUser(
  request: FastifyRequest,
  params: [number, number],
) {
  const { db } = request
  const { message } = request.body as unknown as TelegramResponseType

  try {
    const user = await db()
      .select()
      .from(users)
      // @ts-ignore https://github.com/drizzle-team/drizzle-orm/pull/1792
      .where(eq(users.telegramID, params.at(0)))

    if (user.length === 0) {
      Logger.info(
        'BotSetAdminUser',
        ["Can't find user with id:", params.at(0)].join(' '),
      )
      await messageSender(
        message.chat.id,
        [
          `Cannot set \`user: ${params.at(0)}\` they have to subscribe to the bot first.`,
        ].join(' '),
        'Markdown',
      )
      return
    }

    if (params.at(1) && !request.admin.includes(Number(params.at(1)))) {
      Logger.info(
        'BotSetAdminUser',
        [
          "Can't set user with id:",
          params.at(0),
          'the passcode is incorrect.',
        ].join(' '),
      )

      await messageSender(
        message.chat.id,
        [
          `Cannot set \`user: ${params.at(0)}\` the passcode is incorrect.`,
        ].join(' '),
        'Markdown',
      )
      return
    }

    const setAdmin = await db()
      .update(users)
      .set({ isAdmin: true })
      // @ts-ignore https://github.com/drizzle-team/drizzle-orm/pull/1792
      .where(eq(users.id, user[0].id))
      .returning()

    if (!setAdmin) {
      Logger.info(
        'BotSetAdminUser',
        ["Can't set user with id:", params.at(0), 'an error has occured.'].join(
          ' ',
        ),
      )
      return
    }

    const found = UserModel.parse(user[0])
    //
    // this allows newly registered admins to use admin commands
    request.admin.push(Number(found.telegramID))

    messageSender(
      Number(params.at(0)),
      [
        `🎉 Congrats, [${found.firstName}](tg://user?id=${found.telegramID})! you have been assigned as a **Bot Admin**!`,
        'Check out the Admin commands using `/help`',
      ].join('\n'),
      'Markdown',
    )
    messageSender.flush()
    return
  } catch (err: unknown) {
    Logger.info('BotGetUser', ['Error', (err as Error).message].join(' '))
  }
}
