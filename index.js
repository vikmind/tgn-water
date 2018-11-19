require('dotenv-safe').load({
  allowEmptyValues: true,
});

// Info parser
const axios = require('axios');
const url = process.env.URL;
const { JSDOM } = require('jsdom');
const windows1251 = require('windows-1251');
const crypto = require('crypto');

async function getWaterInfo() {
  const doc = await axios.get(url,{
    responseType: 'arraybuffer',
  }).then(res => (new JSDOM(windows1251.decode(res.data.toString('binary')))).window.document);

  const info = [].slice.call(doc.querySelectorAll('#cont2 table table tr:not(:last-child)>td:first-child>font'))
    .map(node => {
      const text = node.querySelector('font:first-child').textContent + '\n'
        + node.querySelector('font:last-child').textContent;
      return {
        id: crypto.createHash('md5').update(text).digest('hex'),
        text,
      };
    })
    .reverse();

  return info;
}

// Bot part
const token = process.env.TOKEN;
const chat = `@${process.env.CHANNEL}`;

const sendMessage = (chat_id, text) =>
  axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id,
    text,
  });

// Persistence
const sqlite = require('sqlite');
const dbPromise =  sqlite.open('./db.sqlite', { Promise });
const prepareQuery = `
  CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, identifier TEXT, text TEXT);`;
const selectQuery = identifiers =>
  `SELECT identifier FROM messages WHERE messages.identifier IN ('${identifiers.join('\',\'')}')`;
const insertQuery = ({ id, text }) =>
  `INSERT INTO messages(identifier, text) VALUES ('${id}', '${text}')`;

async function main() {
  const db = await dbPromise;
  await db.run(prepareQuery);

  const data = await getWaterInfo();
  const rows = await db.all(selectQuery(data.map(el => el.id)));
  const dbIdentifiers = rows.map(row => row.identifier);
  const newData = data.filter(el => !dbIdentifiers.includes(el.id));

  // Promises in sequence
  await newData.reduce((prev, el) => prev.then(async () => {
    await sendMessage(chat, el.text);
    return db.run(insertQuery(el));
  }), Promise.resolve());
};

main();
