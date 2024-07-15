## Telegram Bot

### prerequisite

this project uses

- node >= v20
- pnpm v9.5.0 (upgrade when necessary via `corepack use pnpm@9.x.x`)

```bash
## Clone the project ofc

$ git clone git@github.com:pongstr/goose.git; pnpm install

## create an .env file for the api service
## and fill in the blanks
$ cat > ./apps/api/.env << EOF

## grab a bot token from BotFather
TG_TOKEN=...
TG_API=https://api.telegram.org/bot

BOT_PROD=             ## e.g. https://bot.somedomain.dev
BOT_HOST=127.0.0.1    ## your machine loopback addr
BOT_PORT=8080         ## there port where your app is running

## database connection the usual stuff
POSTGRES_URL=...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...

## this can be random string
COOKIE_SECRET=

## Admin List, telegram ids you want to set as admin
## separate it with comma e.g., ADMIN_LIST=111,222,333,...
ADMIN_LIST=

EOF

## create an .env file for the web app
## and fill in the blanks
$ cat > ./apps/web/.env << EOF
## the production URL of api service
## actually this is hard-coded right now, i can't
## get Sveltekit `$env/static/public` import to work
## when deploying to vercel, see these files to change:
## - apps/web/src/routes/signup/+server.ts#L-6
## - apps/web/src/routes/profile/+server.ts#L-7
## - apps/web/src/routes/profile/+page.server.ts#L-7
## - apps/web/src/routes/+server.ts#L-6
PUBLIC_API_URL=
EOF


## init your db with our schema
$ pnpm --filter=api run migrate
```

kickstart the apps.

```bash
$ pnpm dev

## selectively run an app
pnpm dev --filter=api|web
```
