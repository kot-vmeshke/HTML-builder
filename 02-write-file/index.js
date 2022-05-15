const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

const { stdout } = process;

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
  stdout.write('Введите текст: \n');
  rl.on('line', (input) => {
    fs.appendFile(
      path.join(__dirname, 'text.txt'),
      `${input}\n`,
      err => {
        if (err) throw err;
        if (input === 'exit') process.exit();
      }
    );
  });
  process.on('exit', () => stdout.write('Удачи!'));
});




