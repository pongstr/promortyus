<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import { CheckIcon, LucideCopy } from 'lucide-svelte'

  export let isDialogOpened = false
  export let displayContent:
    | {
        data: string | null
        error?: string
      }
    | undefined

  const dispatch = createEventDispatcher()
  let showPassword = false
  let showComfirm = false

  let tokenContainer: HTMLPreElement
  let isInClipboard = false

  function createAccount(e: SubmitEvent) {
    const target = e.currentTarget as HTMLFormElement
    const form = new FormData(target)
    dispatch('createAccount', Object.fromEntries(form.entries()))
  }

  function copyToClipboard() {
    if (!tokenContainer) return

    localStorage.setItem('app.token', tokenContainer.innerText.trim())
    navigator.clipboard.writeText(tokenContainer.innerText).then(() => (isInClipboard = true))
  }
</script>

<Dialog.Root open={isDialogOpened}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Account Created</Dialog.Title>
      <Dialog.Description
        >Here's your auth token. Keep it safe and sound; you'll need it for future access.</Dialog.Description
      >
    </Dialog.Header>
    <div class="flex justify-center items-center pt-4">
      <pre
        bind:this={tokenContainer}
        class="w-[360px] text-xs overflow-x-auto border p-4 font-mono text-center rounded bg-zinc-900/[0.5]">{displayContent?.data}</pre>
    </div>
    <p class="text-sm text-center">Here&apos; your token, keep handy, You'll need it later.</p>

    {#if isInClipboard}
      <a
        class="inline-flex gap-3 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
        href="/profile">Go to Dashboard</a
      >
      <span class="text-xs text-green-400 flex justify-center items-center">
        <CheckIcon class="size-4" /> &nbsp; Copied to clipboard
      </span>
    {:else}
      <button
        class="inline-flex gap-3 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
        on:click={() => copyToClipboard()}
      >
        <LucideCopy class="size-4" />
        <span class="font-bold">Copy my token</span>
      </button>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<form
  class="flex flex-col gap-6 p-8 bg-background rounded-lg"
  on:submit|preventDefault={createAccount}
>
  <div class="pb-10">
    <svg viewBox="0 0 312 247" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mx-auto">
      <path
        d="M285.548 129.735V77.8431H259.596V51.8922H233.625V38.9216H259.596V0H220.659V25.9412H194.688V51.8922H116.812V25.9412H90.8607V0H51.9232V38.9216H77.875V51.8922H51.9232V77.8431H25.9713V129.735H0V220.549H38.9375V168.657H51.9232V220.549H77.875V246.5H142.784V207.578H90.8607V194.608H220.659V207.578H168.736V246.5H233.625V220.549H259.596V168.657H272.562V220.549H311.5V129.735H285.548ZM116.812 116.765H77.875V77.8431H116.812V116.765ZM233.625 116.765H194.688V77.8431H233.625V116.765Z"
        fill="currentColor"
      >
      </path>
    </svg>
  </div>
  <div class="space-y-2">
    <label
      class="text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      for="username"
    >
      Telegram ID
    </label>
    <input
      type="number"
      class="flex h-12 w-full rounded border border-input bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-1 focus:outline-none focus:ring-offset-0 focus:ring-primary-foreground"
      id="telegramID"
      name="telegramID"
      placeholder="e.g. 1234567890"
      value=""
      required
    />
  </div>
  <div class="space-y-2">
    <div class="relative space-y-2">
      <label
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        for="password">Create Password</label
      >
      <input
        type={showPassword ? 'text' : 'password'}
        class="flex h-12 w-full rounded border border-input bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-1 focus:outline-none focus:ring-offset-0 focus:ring-primary-foreground pr-12"
        id="password"
        name="password"
        placeholder="New Password"
        value=""
      />

      <button
        class="absolute bottom-4 right-4"
        type="button"
        on:click={() => (showPassword = !showPassword)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4"
        >
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
      </button>
    </div>

    <span class="flex justify-between items-center text-xs text-primary leading-relaxed"> </span>

    <div class="relative space-y-2">
      <label
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        for="confirm-password">Confirm Password</label
      >
      <input
        type={showComfirm ? 'text' : 'password'}
        class="flex h-12 w-full rounded border border-input bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-1 focus:outline-none focus:ring-offset-0 focus:ring-primary-foreground pr-12"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm Password"
        value=""
      />

      <button
        class="absolute bottom-4 right-4"
        type="button"
        on:click={() => (showComfirm = !showComfirm)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4"
        >
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
      </button>
    </div>
  </div>

  <div class="space-y-4 pt-4">
    <button
      class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
      type="submit"
    >
      <span class="font-semibold">Create Account</span>
    </button>

    <hr class="border-border block" />

    <a
      href="/"
      class="w-full bg-background hover:bg-muted/[0.5] transition-colors py-3 rounded-lg flex justify-center
      items-center text-muted-foreground hover:text-foreground gap-4 border"
    >
      <span class="text-sm">Sign in to Dashboard</span>
    </a>

    <span class="block text-center text-xs text-muted-foreground leading-relaxed">
      By clicking the Log in button, you agree to <br /> Pongstr&apos;s
      <a
        class="underline text-muted-foreground transition-colors hover:text-primary"
        href="http://www.pongstr.io/privacy-policy">Terms of Service</a
      >
      &amp;
      <a
        class="text-muted-foreground underline transition-colors hover:text-primary"
        href="http://www.pongstr.io/privacy-policy"
      >
        Privacy Policy
      </a>.
    </span>
  </div>
</form>
