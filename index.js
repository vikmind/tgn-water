require('dotenv-safe').load();

// Bot part
const axios = require('axios');
const token = process.env.TOKEN;
const chat = process.env.CHANNEL;
const admin = process.env.ADMIN_CHAT_ID;

const sendMessage = (chat_id, text) =>
  axios.post(`${process.env.TG_API_URL}/bot${token}/sendMessage`, {
    chat_id,
    text,
  }).catch(e => console.error(e.message));

const errorHandler = (e) => sendMessage(admin, e.message);

// Persistence
const sqlite = require('sqlite');
const dbPromise =  sqlite.open('./db.sqlite', { Promise });
const prepareQuery = `
  CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, identifier TEXT, text TEXT);`;
const selectQuery = identifiers =>
  `SELECT identifier FROM messages WHERE messages.identifier IN ('${identifiers.join('\',\'')}')`;
const insertQuery = ({ id, text }) =>
  `INSERT INTO messages(identifier, text) VALUES ('${id}', '${text}')`;

const getInfo = require(`./${process.env.INFO_SCRIPT}`);

async function main() {
  try {
    const db = await dbPromise;
    await db.run(prepareQuery);

    const data = await getInfo();
    const rows = await db.all(selectQuery(data.map(el => el.id)));
    const dbIdentifiers = rows.map(row => row.identifier);
    const newData = data.filter(el => !dbIdentifiers.includes(el.id));

    // Promises in sequence
    await newData.reduce((prev, el) => prev.then(async () => {
      await sendMessage(chat, el.text);
      return db.run(insertQuery(el));
    }), Promise.resolve());
  } catch(e) {
    errorHandler(e);
  }
};

main();
