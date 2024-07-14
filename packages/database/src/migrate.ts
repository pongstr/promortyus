import { setupMigrate } from './setup'
//
;(async () => {
  try {
    await setupMigrate()
    process.exit(0)
  } catch (error: unknown) {
    console.log(error)
  }
})()
