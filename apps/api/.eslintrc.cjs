/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@pongstr/eslint-config/fastify.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist'],
  rules: {
    // Override the default configuration
    quotes: [2, 'single', { avoidEscape: true }],
  },
}
