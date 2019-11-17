const fs = require('fs');
const path = require('path');

fs.appendFileSync(path.join('client', 'static', 'text.json'), '"}');

fs.copyFile(path.join('client', 'static', 'text.json'), path.join('server', 'data', 'text.json'), err => {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
});
