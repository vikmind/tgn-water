require('dotenv-safe').load();

const axios = require('axios');
const token = process.env.TOKEN;

axios.get(`https://api.telegram.org/bot${token}/getUpdates`)
  .then(res => console.log('Your chat_id:', res.data.result[0].message.chat.id))
  .catch(e => console.error(e.message));
