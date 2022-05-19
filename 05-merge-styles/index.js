const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

try {
  fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isFile() && path.extname(data[i].name) === '.css') {
          const readStream = fs.createReadStream(path.join(__dirname, 'styles', data[i].name));
          readStream.on('data', chunk => {
            bundle.write(chunk);
          });
        }
      }
    });
} catch (err) {
  console.error(err);
}