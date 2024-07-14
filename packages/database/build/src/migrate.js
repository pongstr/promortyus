'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const setup_1 = require('./setup')
;(async () => {
  try {
    await (0, setup_1.setupMigrate)()
    process.exit(0)
  } catch (error) {
    console.log(error)
  }
})()
