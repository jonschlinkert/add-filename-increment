'use strict';

var fs = require('fs');
var path = require('path');
var File = require('vinyl');
var isWindows = require('is-windows')();
var stripIncrement = require('strip-filename-increment');

function increment(srcPath, destPath, options) {
  if (typeof destPath !== 'string') {
    throw new TypeError('expected a destPath to be a string');
  }

  if (typeof srcPath !== 'string') {
    throw new TypeError('expected a srcPath to be a string');
  }

  var file = new File({path: srcPath});
  file.path = destPath;
  increment.file(file, options);
  return file.path;
}

increment.file = function(file, options) {
  if (!File.isVinyl(file)) {
    throw new Error('expected a Vinyl file');
  }

  if (typeof options === 'function') {
    options = { increment: options };
  }

  var opts = Object.assign({}, options);
  if (opts.stripIncrement !== false) {
    file.stem = stripIncrement(file.stem);
  }

  var dirname = path.dirname(file.history[0]);
  var stem = file.stem;
  var num = 1;
  var idx = 0;

  while (fs.existsSync(file.path)) {
    if (typeof opts.increment === 'function') {
      file.stem = opts.increment(stem, ++num, file);
    } else if (isWindows || opts.windows) {
      file.stem = stem + ' (' + (++num) + ')';
    } else {
      file.stem = stem + ' ' + (++num);
    }

    idx++;
  }

  return file;
};

module.exports = increment;
