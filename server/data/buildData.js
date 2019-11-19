const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const outputLocation = path.join('lstm', 'data', 'text.json');
const timeoutBetweenCalls = 500; // ms
const baseLink = 'http://dainuskapis.lv/meklet/';
const search = '*';
const pages = 100; // theoritical max value 6673

// For recursive synchronous loops
let scrapeDataDepth = 0;
let cleanDainaDepth = 0;
let totalDepth = 0;

const buildData = async () => {
  if (scrapeDataDepth < pages) {
    await request(`${baseLink}${scrapeDataDepth * 10}/${search}`, async (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = await cheerio.load(html);
        const dainas = $('.daina');

        const cleanDaina = async () => {
          if (cleanDainaDepth < dainas.length) {
            const dainaSpan = $(dainas[cleanDainaDepth])
              .children()
              .text();

            const dainaText = $(dainas[cleanDainaDepth])
              .text()
              .replace(/\s\s+/g, 'x');

            const lineBreak = `x${cleanDainaDepth !== dainas.length - 1 ? 'x' : ''}`;
            const dainaParsed = await dainaText
              .replace(dainaSpan, '') // Daina number
              .replace(/\((.*?)\)/g, '') // Synonyms
              .replace(/\)NN-os\)/gi, '') // Anomaly
              .replace(/xDzīpara\)/g, '') // Anomaly
              .replace(/\(negāju/g, '') // Anomaly
              .replace(/"/g, "'")
              .replace(/[âáà]/g, 'ā')
              .replace(/[êéè]/g, 'ē')
              .replace(/[îíì]/g, 'ī')
              .replace(/[ôóòō]/g, 'o')
              .replace(/[ûúù]/g, 'ū')
              .replace(/[ÂÁÀ]/g, 'Ā')
              .replace(/[ÊÉÈ]/g, 'Ē')
              .replace(/[ÎÍÌ]/g, 'Ī')
              .replace(/[ÔÓÒŌ]/g, 'O')
              .replace(/[ÛÚÙ]/g, 'Ū')
              .replace(/w/g, 'v')
              .replace(/W/g, 'V')
              .replace(/ş/g, 'š')
              .replace(/Ş/g, 'Š')
              .replace(/ç/g, 'č')
              .replace(/Ç/g, 'Č');

            fs.appendFileSync(outputLocation, dainaParsed + lineBreak);

            cleanDainaDepth++;
            totalDepth++;
            if (totalDepth === pages * 10) {
              fs.appendFileSync(outputLocation, 'x"}');
            } else if (cleanDainaDepth === 10) {
              fs.appendFileSync(outputLocation, 'x');
            }

            await cleanDaina();
          }
        };

        await cleanDaina();
        cleanDainaDepth = 0;
      }
    });

    scrapeDataDepth += 1;

    setTimeout(async () => {
      await buildData();
    }, timeoutBetweenCalls);
  }
};

// Delete existing data file
if (fs.existsSync(outputLocation)) fs.unlinkSync(outputLocation);

// Append opening json data
fs.appendFileSync(outputLocation, '{ "data": "');

buildData();
