# [t.me/tgn_voda_info](https://t.me/tgn_voda_info)

Scraper and telegram bot for http://tgnvoda.ru/avarii.php.

## Setup your own scraper and channel

You can use this project as a template for your own updates channel. In order to do so, you should

1. Fork the repo
1. Create scraper script using `getWaterInfo.js` as example
1. Replace `getWaterInfo` in `.github/workflows/runner.yml`
1. Create your bot by chatting to [BotFather](https://t.me/botfather) and setup `TOKEN` secret (github.com/user/repo/settings/secrets/actions)
1. Create channel and setup `CHANNEL` secret
1. Add bot to the channel as admin
1. Get chat id for error reporting:
    1. Write to your bot
    1. Run `npm run chat_id`
    1. Set `ADMIN_CHAT_ID` secret (you can use it for debugging instead of `CHANNEL`)
1. Create credentials for docker hub [here](https://hub.docker.com/settings/security).
1. Set `DOCKERHUB_TOKEN` and `DOCKERHUB_USERNAME` secrets.
