# [t.me/tgn_voda_info](https://t.me/tgn_voda_info)
Scraper and telegram bot for http://tgnvoda.ru/avarii.php

## Setup your own scraper and channel

> If you want to use [dotenv](https://github.com/motdotla/dotenv) for managing environment variables, create ``.env`` file using ``.env.example`` as template.

You can use this project as a template for your own updates channel. Write any implementation of scraper function returning data in format ``[{ id, text }]`` (check ``getWaterInfo.js`` as example) and set ``INFO_SCRIPT`` variable with its name. The next steps are:

1. Create your bot by chatting to [BotFather](https://t.me/botfather) and fill ``TOKEN`` variable
1. Create channel and fill ``CHANNEL`` variable
1. Add bot to the channel as admin
1. Get chat id for error reporting:
    1. Write to your bot
    1. Run ``npm run chat_id``
    1. Set ``ADMIN_CHAT_ID``
1. Setup job for checking updates on any machine with any intervals, crontab config for @tgn_water_info:
    ```crontab
    5,20,35,50 8-23 * * * cd /home/user/projects/tgn-water && /home/user/.nvm/versions/node/v10.12.0/bin/node /home/user/projects/tgn-water/index.js
    ```
