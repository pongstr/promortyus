import clc from 'cli-color'

/** @todo
 * I don't know if I want this. Pretty sure it's not necessary.
 **/

class Logger {
  public static info(prefix: string, message: string) {
    console.log(`[${clc.cyan(prefix)}] ${message}`)
  }

  public static error(prefix: string, message: string) {
    console.log(`[${clc.red(prefix)}] ${message}`)
  }

  public static success(prefix: string, message: string) {
    console.log(`[${clc.green(prefix)}] ${message}`)
  }
}

export { Logger }
