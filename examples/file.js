var path = require('path');
var File = require('vinyl');
var increment = require('../');
var file = new File({ path: path.join(__dirname, '../test/fixtures/foo.txt') });
increment.file(file);
console.log(file.path);
