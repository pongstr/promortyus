import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ cookies }) {
  const token = cookies.get('app.token')

  if (!token) {
    return
  }

  redirect(307, '/profile')
}
