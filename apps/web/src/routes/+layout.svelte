<script>
  import '../app.css'
  import { dev } from '$app/environment'
  import { inject } from '@vercel/analytics'

  inject({ mode: dev ? 'development' : 'production' })
</script>

<div class="w-screen h-screen flex justify-center items-center">
  <slot></slot>
</div>
