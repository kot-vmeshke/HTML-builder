const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) throw err;
});
try {
  fsPromises.readdir(path.join(__dirname, 'files'), { withFileTypes: true })
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        fsPromises.copyFile(path.join(__dirname, 'files', data[i].name), path.join(__dirname, 'files-copy', data[i].name));
      }
    });
} catch (err) {
  console.error(err);
}
