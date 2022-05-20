const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const readTemplate = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

let template;

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

readTemplate.on('data', chunk => {
  template = chunk;
  try {
    fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true })
      .then(data => {
        let arrNames = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].isFile() && path.extname(data[i].name) === '.html') {
            arrNames.push(data[i].name.split('.')[0]);
          }
        }
        for (let k = 0; k < arrNames.length; k++) {
          let component;
          const readStream = fs.createReadStream(path.join(__dirname, 'components', data[k].name), 'utf-8');
          readStream.on('data', chunk => {
            component = chunk;
            template = template.replace(`{{${arrNames[k]}}}`, component);
            const index = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
            index.write(template);
          });
        }
      });
  } catch (err) {
    console.error(err);
  }
});

const style = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

try {
  fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isFile() && path.extname(data[i].name) === '.css') {
          const readStream = fs.createReadStream(path.join(__dirname, 'styles', data[i].name));
          readStream.on('data', chunk => {
            style.write(`${chunk}\n`);
          });
        }
      }
    });
} catch (err) {
  console.error(err);
}

fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, (err) => {
  if (err) throw err;
});
try {
  fsPromises.readdir(path.join(__dirname, 'assets'), { withFileTypes: true })
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isDirectory()) {
          fs.mkdir(path.join(__dirname, 'project-dist', 'assets', data[i].name), { recursive: true }, (err) => {
            if (err) throw err;
          });
          fsPromises.readdir(path.join(__dirname, 'assets', data[i].name), { withFileTypes: true })
            .then((item) => {
              for (let j = 0; j < item.length; j++) {
                fsPromises.copyFile(path.join(__dirname, 'assets', data[i].name, item[j].name), path.join(__dirname, 'project-dist', 'assets', data[i].name, item[j].name));
              }
            });
        } else {
          fsPromises.copyFile(path.join(__dirname, 'assets', data[i].name), path.join(__dirname, 'project-dist', 'assets', data[i].name));
        }
      }
    });
} catch (err) {
  console.error(err);
}