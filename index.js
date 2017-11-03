'use strict';

var fs = require('fs');
var path = require('path');
var File = require('vinyl');
var isWindows = require('is-windows')();
var stripIncrement = require('strip-filename-increment');

/**
 * Increment the given `destPath` if `srcPath` already exists
 * and is not the same file as `destPath`.
 *
 * ```js
 * var fp = increment(srcPath[, destPath, options]);
 * ```
 * @param {String} `srcPath` (required)
 * @param {String} `destPath` (optional)
 * @param {Object} `options` (optional)
 * @return {String}
 * @api public
 */

function increment(srcPath, destPath, options) {
  if (typeof srcPath !== 'string') {
    throw new TypeError('expected a srcPath to be a string');
  }
  if (typeof destPath !== 'string') {
    options = destPath;
    destPath = srcPath;
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

  var orig = file.history[0];
  var stem = file.stem;
  var num = 1;
  var idx = 0;

  while (fs.existsSync(file.path)) {
    idx++;

    if (typeof opts.increment === 'function') {
      file.stem = opts.increment(stem, ++num, file);
      continue;
    }

    if (isWindows || opts.windows) {
      var match = /(.*)(?:\((\d+)\)(?: - Copy)+)+$/i.exec(stem);
      if (match) {
        file.stem = match[1] + '(' + (+match[2] + 1) + ') - Copy';
      } else if (idx === 1 && file.path === orig) {
        file.stem = stem + ' - Copy';
      } else {
        file.stem = stem + ' (' + (++num) + ')';
      }
      continue;
    }

    if (idx === 1 && file.path === orig) {
      file.stem = stem.replace(/(?: -)? copy$/i, '') + ' copy';
    } else {
      file.stem = stem + ' ' + (++num);
    }
  }

  return file;
};

module.exports = increment;
