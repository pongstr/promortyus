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
# these variables has to be added to `turbo.json#tasks.build.env`


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
# this has to be added to `turbo.json#tasks.build.env`
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
