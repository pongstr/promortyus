// FIXME:
// @ts-ignore i dunno why dafuq the type for this isn't working
// import { PUBLIC_API_URL } from '$env/static/public'

import { redirect } from '@sveltejs/kit'

const PUBLIC_API_URL = 'https://gram.pongstr.io'

export async function PUT({ request }) {
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
    console.log('er', err)
    throw redirect(307, '/')
  }
}
