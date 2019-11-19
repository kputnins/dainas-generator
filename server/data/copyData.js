/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

fs.appendFileSync(path.join('client', 'static', 'text.json'), '"}');

fs.copyFile(path.join('client', 'static', 'text.json'), path.join('server', 'data', 'text.json'), err => {
  if (err) throw err;
});

console.log('data created and copied to ');
console.log(path.join('client', 'static', 'text.json'));
console.log(path.join('server', 'data', 'text.json'));
