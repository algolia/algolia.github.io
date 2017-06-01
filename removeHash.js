
const glob = require('glob').sync;
const fs = require('fs');

const files = glob('./build/*.html');

files.forEach(file => {
  const newName = file.replace(/(\-.*)\./g, '.');
  fs.rename(file, newName);
})