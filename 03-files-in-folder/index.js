const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

try {
  fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
    .then(data => {
      for ( let i = 0; i < data.length; i++) {
        if (data[i].isFile()) {
          let name = data[i].name.split('.')[0];
          let ext = path.extname(data[i].name).slice(1);
          fs.stat(path.join(__dirname, 'secret-folder', data[i].name), (err, stats) => {
            console.log(`${name} - ${ext} - ${stats.size}b`);
          });
        } 
      }
    });
} catch (err) {
  console.error(err);
}