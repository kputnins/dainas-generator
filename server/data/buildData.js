const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const writeStream = fs.createWriteStream('./server/data/text/dainas.txt');
const baseLink = 'http://dainuskapis.lv/meklet/';
const search = '*';

// Change max value to include all dainas
for (let i = 0; i < 10; i += 10) {
  request(`${baseLink}${i}/${search}`, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);

      const dainas = $('.daina');

      dainas.each((j, daina) => {
        const dainaSpan = $(daina)
          .children()
          .text();

        const dainaText = $(daina)
          .text()
          .replace(/\s\s+/g, '\n');

        const lineBreak = `\n${j !== dainas.length - 1 ? '\n' : ''}`;
        const dainaParsed = dainaText.replace(dainaSpan, '') + lineBreak;

        writeStream.write(dainaParsed);
      });
    }
  });
}
