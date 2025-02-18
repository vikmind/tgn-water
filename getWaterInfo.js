const axios = require('axios');
const { JSDOM } = require('jsdom');
const windows1251 = require('windows-1251');
const crypto = require('crypto');
const url = 'http://tgnvoda.ru/avarii.php';

module.exports = async function getWaterInfo() {
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
    .filter(({ text }) => !text.includes('href') && !text.includes('script'))
    .reverse();

  return info;
}
