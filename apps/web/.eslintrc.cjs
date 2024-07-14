/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@pongstr/eslint-config/sveltekit.cjs'],
  parserOptions: {
    project: false,
  },
  ignorePatterns: ['dist'],
}
