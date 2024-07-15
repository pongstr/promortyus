import { PUBLIC_API_URL } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, cookies }) {
  const url = new URL('api/validate', PUBLIC_API_URL)
  const token = cookies.get('app.token')

  if (!token) {
    throw redirect(307, '/logout')
  }

  try {
    const req = await fetch(url.href, {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const res = await req.json()

    if (typeof res === 'object' && Reflect.has(res.data, '0')) {
      return {
        token,
        user: { ...res.data['0'], iat: res.data.iat },
      }
    }

    return {
      token,
      user: res.data,
    }
  } catch (err: unknown) {
    throw redirect(307, '/')
  }
}
