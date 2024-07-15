import { json } from '@sveltejs/kit'
// FIXME:
// @ts-ignore i dunno why dafuq the type for this isn't working
// import { PUBLIC_API_URL } from '$env/static/public'

const PUBLIC_API_URL = 'https://gram.pongstr.io'

export async function POST({ request, cookies }) {
  const url = new URL('api/login', PUBLIC_API_URL)

  try {
    const body = await request.json()
    const req = await fetch(url.href, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    })
    const res = await req.json()

    if (!res || !res.token) {
      return json(res)
    }

    cookies.set('app.token', res.token, { path: '/' })
    return json(res)
  } catch (err: unknown) {
    const message = (err as Error).message
    return json({ status: 'error', message })
  }
}
