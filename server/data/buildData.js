const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const writeStream = fs.createWriteStream(path.join('client', 'static', 'text.json'));
const baseLink = 'http://dainuskapis.lv/meklet/';
const search = '*';
const pages = 6673;

const scrape = async () => {
  // Change max value to include all dainas
  for (let i = 0; i < pages; i += 1) {
    request(`${baseLink}${i * 10}/${search}`, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);

        const dainas = $('.daina');

        dainas.each((j, daina) => {
          const dainaSpan = $(daina)
            .children()
            .text();

          const dainaText = $(daina)
            .text()
            .replace(/\s\s+/g, 'x');

          const lineBreak = `x${j !== dainas.length - 1 ? 'x' : ''}`;
          const dainaParsed = dainaText.replace(dainaSpan, '') + lineBreak;

          writeStream.write(dainaParsed);
        });
      }
    });
  }
};

const saveData = async () => {
  await writeStream.write('{ "data": "');
  await scrape();
};

saveData();
