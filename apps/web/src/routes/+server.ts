import { json } from '@sveltejs/kit'
import { PUBLIC_API_URL } from '$env/static/public'

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
