import { json } from '@sveltejs/kit'
import { PUBLIC_API_URL } from '$env/static/public'

export async function POST({ request, cookies }) {
  const url = new URL('api/signup', PUBLIC_API_URL)

  try {
    const body = await request.json()

    if (body.password.trim() !== body.confirmPassword.trim()) {
      return json(
        { status: 400, message: "Passwords don't match" },
        { status: 400, statusText: "Passwords don't match" },
      )
    }

    const req = await fetch(url.href, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    })
    const res = await req.json()

    cookies.set('app.token', res.token, { path: '/' })

    return json(res)
  } catch (err: unknown) {
    const message = (err as Error).message
    return json({ status: 'error', message })
  }
}
