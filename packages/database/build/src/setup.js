'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.setupMigrate = void 0
const schema = __importStar(require('./schema'))
const path_1 = require('path')
const utils_1 = require('./utils')
const vercel_postgres_1 = require('drizzle-orm/vercel-postgres')
const postgres_1 = require('@vercel/postgres')
const migrator_1 = require('drizzle-orm/node-postgres/migrator')
const migrationsFolder = (0, path_1.resolve)(__dirname, 'migrations')
const setupMigrate = async () => {
  const db = (0, vercel_postgres_1.drizzle)(postgres_1.sql, {
    schema,
  })
  await (0, migrator_1.migrate)(db, { migrationsFolder })
    .then(() => utils_1.Logger.info('INIT', 'Migrated database'))
    .catch((error) => {
      console.log(JSON.stringify(error))
      utils_1.Logger.error(
        'INIT',
        `Failed to migrate database ${String(error)}`,
      )
      throw new Error(`Failed to migrate database ${String(error)}`)
    })
}
exports.setupMigrate = setupMigrate
