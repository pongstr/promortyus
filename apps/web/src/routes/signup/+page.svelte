<script lang="ts">
  import AccountCreate from '$lib/login/AccountCreate.svelte'

  let isDialogOpened = false
  let displayContent:
    | {
        data: string | null
        error?: string
      }
    | undefined

  const createAccount = async ({
    detail,
  }: CustomEvent<{ telegramID: number; password: string }>) => {
    const { telegramID, password } = detail

    try {
      const request = await fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ telegramID, password }),
        headers: {
          'content-type': 'application/json',
        },
      })

      const response = await request.json()

      isDialogOpened = true
      displayContent = {
        data: response.token,
      }
    } catch (err: unknown) {
      displayContent = {
        error: '',
        data: (err as Error).message,
      }
    }
  }
</script>

<svelte:head>
  <title>Create Account | Pongstr Telegram Bot</title>
</svelte:head>

<div class="rounded-lg border w-[420px] bg-background">
  <AccountCreate {isDialogOpened} {displayContent} on:createAccount={createAccount} />
</div>
