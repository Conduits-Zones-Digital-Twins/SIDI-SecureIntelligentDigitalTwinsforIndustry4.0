const fs = require('fs');
// fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
//   if (err) return console.log(err);
//   console.log('Hello World > helloworld.txt');
// });

fs.appendFileSync('helloworld.txt', 'header');

fs.appendFile('helloworld.txt', '\ndata to append 1', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  fs.appendFile('helloworld.txt', '\ndata to append 2', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });