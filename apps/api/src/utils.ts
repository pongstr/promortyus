import 'dotenv/config'

import { Logger } from '@/db'

export const TGR_ENDPOINT = new URL(
  [process.env.TG_API, process.env.TG_TOKEN].join(''),
)

export const BOT_ENDPOINT = new URL(
  [process.env.BOT_PROD, 'webhook', process.env.TG_TOKEN].join('/'),
)

export async function webhook() {
  const endpoint = new URL(TGR_ENDPOINT)

  endpoint.pathname = [endpoint.pathname, 'setWebhook'].join('/')
  endpoint.searchParams.set('url', BOT_ENDPOINT.href)

  try {
    const req = await fetch(endpoint.href, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })

    if (!req.ok) {
      Logger.error(
        'Setup Webhook',
        [
          new Date().toUTCString(),
          'Failed',
          'Established connection + webhook setup',
          JSON.stringify({ status: req.status, message: req.statusText }),
        ].join(','),
      )
      throw new Error(req.statusText)
    }

    Logger.info(
      'Setup Webhook',
      [
        new Date().toUTCString(),
        'Success',
        'Established connection + webhook setup',
        JSON.stringify(await req.json()),
      ].join(','),
    )
  } catch (err: unknown) {
    const error = err as Error
    Logger.error(
      'Setup Webhook',
      [
        new Date().toUTCString(),
        'Failed',
        'Established connection + webhook setup',
        error.message,
      ].join(','),
    )
    throw error
  }
}
