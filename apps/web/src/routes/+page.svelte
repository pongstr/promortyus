<script lang="ts">
  import { goto } from '$app/navigation'
  import AccountSignIn from '$lib/login/AccountSignIn.svelte'

  let feedback:
    | {
        hasError: boolean
        message: string
      }
    | undefined = undefined

  const signInAccount = async ({
    detail,
  }: CustomEvent<{ telegramID: number; password: string }>) => {
    const { telegramID, password } = detail

    try {
      const request = await fetch('/', {
        method: 'POST',
        body: JSON.stringify({ telegramID, password }),
        headers: {
          'content-type': 'application/json',
        },
      })
      const response = await request.json()

      if (response.code !== 200) {
        feedback = {
          hasError: true,
          message: response.message,
        }
        return
      }
      goto('/profile?login=true')
    } catch (err: unknown) {
      console.log(err)
    }
  }
</script>

<svelte:head>
  <title>Sign In | Pongstr Telegram Bot</title>
</svelte:head>

<div class="rounded-lg border w-[420px] bg-background">
  <AccountSignIn on:signInAccount={signInAccount} {feedback} />
</div>
