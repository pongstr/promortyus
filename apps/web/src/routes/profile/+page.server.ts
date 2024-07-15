// FIXME:
// @ts-ignore i dunno why dafuq the type for this isn't working
// import { PUBLIC_API_URL } from '$env/static/public'

import { redirect } from '@sveltejs/kit'

const PUBLIC_API_URL = 'https://gram.pongstr.io'

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

    return {
      token: res.token,
      user: res.data,
    }
  } catch (err: unknown) {
    throw redirect(307, '/')
  }
}
