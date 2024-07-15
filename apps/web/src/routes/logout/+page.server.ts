import { redirect } from '@sveltejs/kit'
export const actions = {
  default: async (event: any) => {
    event.cookies.delete('app.token', {
      httpOnly: true,
      path: '/',
      secure: false,
      sameSite: false,
      maxAge: 60 * 60,
    })
    redirect(301, '/')
  },
}
