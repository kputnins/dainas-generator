const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const outputLocation = path.join('lstm', 'data', 'text.json');
const baseLink = 'http://dainuskapis.lv/meklet/';
const search = '*';
const pages = 2; // max value 6673

if (fs.existsSync(outputLocation)) fs.unlinkSync(outputLocation);

// Append opening json data
fs.appendFileSync(outputLocation, '{ "data": "');

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
        const dainaParsed = dainaText
          .replace(dainaSpan, '')
          .replace(/\((.*?)\)/gi, '')
          .replace(/"/g, "'")
          .replace(/[âáà]/gi, 'ā')
          .replace(/[êéè]/gi, 'ē')
          .replace(/[îíì]/gi, 'ī')
          .replace(/[ôóòō]/gi, 'o')
          .replace(/[ûúù]/gi, 'ū')
          .replace(/[w]/gi, 'v')
          .replace(/ş/gi, 'š')
          .replace(/ç/gi, 'č');

        fs.appendFile(outputLocation, dainaParsed + lineBreak, () => {
          // If last append, then after that append closing json data
          if (j === dainas.length - 1 && i === pages - 1) fs.appendFileSync(outputLocation, '"}');
        });
      });
    }
  });
}
