<script lang="ts">
  import { page } from '$app/stores'
  import { PUBLIC_API_URL } from '$env/static/public'

  import { CheckIcon, FingerprintIcon, HashIcon, XIcon } from 'lucide-svelte'
  import dayjs from 'dayjs'
  import { goto } from '$app/navigation'
  export let data

  let showRevalidate = false
  let hasError = false
  let tokenIsValid: string | undefined

  const returning = $page.url.searchParams.get('login')

  async function validate(e: SubmitEvent) {
    const target = e.currentTarget as HTMLFormElement
    const form = new FormData(target)

    const token = form.get('token')

    if (!token) return
    const url = new URL('api/validate', PUBLIC_API_URL)

    try {
      const req = await fetch(url.href, {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'content-type': 'application/json',
        },
      })

      const res = await req.json()

      if (res.code !== 200) {
        tokenIsValid = res.message
        hasError = true
        return
      }

      tokenIsValid = res.message
      showRevalidate = false
      hasError = false
    } catch (err: unknown) {
      goto('/')
    }
  }
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<div
  class="md:min-w-[700px] flex justify-center items-center max-w-5xl p-4 border rounded-lg md:min-h-[60vh]"
>
  <div>
    {#if data.user}
      <div class="flex justify-center items-center gap-1">
        <HashIcon class="size-5 text-muted-foreground" />
        <span class="text-muted-foreground">Telegram ID:</span>
        <code class="text-xl ml-3">{data.user.telegramID}</code>
      </div>
    {/if}

    {#if showRevalidate}
      <form class="space-y-4 py-4 md:min-w-[420px]" on:submit|preventDefault={validate}>
        {#if Boolean(returning)}
          <textarea
            name="token"
            id="token"
            rows="8"
            placeholder="Copy+Paste your token here..."
            class="flex w-full rounded border-2 border-input bg-background p-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-1 focus:outline-none focus:ring-offset-0 focus:ring-primary-foreground"
            >{data.token}</textarea
          >
        {:else}
          <textarea
            name="token"
            id="token"
            rows="8"
            placeholder="Copy+Paste your token here..."
            class="flex w-full rounded border-2 border-input bg-background p-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-1 focus:outline-none focus:ring-offset-0 focus:ring-primary-foreground"
          />
        {/if}

        {#if tokenIsValid && hasError}
          <div class="flex justify-center items-center gap-2 text-red-600 text-sm">
            <XIcon class="size-4" />
            <span>Invalid Token</span>
          </div>
        {/if}

        <button
          type="submit"
          class="inline-flex gap-3 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
        >
          <FingerprintIcon class="size-4" />
          <span class="font-bold">Validate Token</span>
        </button>
        <button
          type="button"
          class="text-center w-full block text-xs text-muted-foreground"
          on:click={() => {
            showRevalidate = !showRevalidate
            tokenIsValid = undefined
          }}>Cancel</button
        >
      </form>
    {:else}
      <div class="space-y-4 py-4">
        <div class="flex flex-col rounded bg-muted/[0.5] p-4 border">
          <code>{data.user.telegramID}</code>
          <code>*******</code>
          <code>Created: {dayjs(data.user.iat * 1000).format('DD.M.YYYY')}</code>
        </div>

        {#if tokenIsValid && !hasError}
          <div class="flex justify-center items-center gap-2 text-green-400 text-sm">
            <CheckIcon class="size-4" />
            <span>{tokenIsValid}</span>
          </div>
        {/if}

        <button
          type="submit"
          class="inline-flex gap-3 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
          on:click={() => {
            showRevalidate = !showRevalidate
            tokenIsValid = undefined
          }}
        >
          <FingerprintIcon class="size-4" />
          <span class="font-bold">Revalidate Token</span>
        </button>
        <form method="POST" action="/logout">
          <button type="submit" class="text-center w-full block text-xs text-muted-foreground"
            >Logout</button
          >
        </form>
      </div>
    {/if}
  </div>
</div>
