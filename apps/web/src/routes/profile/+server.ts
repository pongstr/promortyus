import { PUBLIC_API_URL } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

export async function POST({ request }) {
  const url = new URL('api/validate', PUBLIC_API_URL)
  try {
    const token = await request.json()
    const req = await fetch(url.href, {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const res = await req.json()
    return {
      token,
      user: res.data[0],
    }
  } catch (err: unknown) {
    throw redirect(307, '/')
  }
}
