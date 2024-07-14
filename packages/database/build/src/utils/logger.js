'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.Logger = void 0
const cli_color_1 = __importDefault(require('cli-color'))
/** @todo
 * I don't know if I want this. Pretty sure it's not necessary.
 **/
class Logger {
  static info(prefix, message) {
    console.log(`[${cli_color_1.default.cyan(prefix)}] ${message}`)
  }
  static error(prefix, message) {
    console.log(`[${cli_color_1.default.red(prefix)}] ${message}`)
  }
  static success(prefix, message) {
    console.log(`[${cli_color_1.default.green(prefix)}] ${message}`)
  }
}
exports.Logger = Logger
