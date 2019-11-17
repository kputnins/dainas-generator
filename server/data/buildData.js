const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const writeStreamTXT = fs.createWriteStream(path.join('server', 'data', 'text.txt'));
const writeStreamJSON = fs.createWriteStream(path.join('client', 'static', 'text.json'));
const baseLink = 'http://dainuskapis.lv/meklet/';
const search = '*';
const pages = 10;

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

          const dainaTextTXT = $(daina)
            .text()
            .replace(/\s\s+/g, '\n');

          const dainaTextJSON = $(daina)
            .text()
            .replace(/\s\s+/g, 'x');

          const lineBreakTXT = `\n${j !== dainas.length - 1 ? '\n' : ''}`;
          const lineBreakJSON = `x${j !== dainas.length - 1 ? 'x' : ''}`;
          const dainaParsedTXT = dainaTextTXT.replace(dainaSpan, '') + lineBreakTXT;
          const dainaParsedJSON = dainaTextJSON.replace(dainaSpan, '') + lineBreakJSON;

          writeStreamTXT.write(dainaParsedTXT);
          writeStreamJSON.write(dainaParsedJSON);
        });
      }
    });
  }
};

const saveData = async () => {
  await writeStreamJSON.write('{ "data": "');
  await scrape();
};

saveData();
