'use strict';

const fs = require('fs');
const path = require('path');
const strip = require('strip-filename-increment');
const ordinals = ['th', 'st', 'nd', 'rd'];

const ordinal = n => {
  if (isNaN(n)) {
    throw new TypeError('expected a number');
  }
  return ordinals[((n % 100) - 20) % 10] || ordinals[n % 100] || ordinals[0];
};

const toOrdinal = number => {
  return `${Number(number)}${ordinal(Math.abs(number))}`;
};

const format = {
  darwin(stem, n) {
    if (n === 1) return `${stem} copy`;
    if (n > 1) return `${stem} copy ${n}`;
    return stem;
  },
  default: (stem, n) => n > 1 ? `${stem} (${n})` : stem,
  win32: (stem, n) => n > 1 ? `${stem} (${n})` : stem,
  windows: (stem, n) => format.win32(stem, n),
  linux(stem, n) {
    if (n === 0) return stem;
    if (n === 1) return `${stem} (copy)`;
    if (n === 2) return `${stem} (another copy)`;
    return `${stem} (${toOrdinal(n)} copy)`;
  }
};

/**
 * The main export is a function that adds a trailing increment to
 * the `stem` (basename without extension) of the given file path or object.
 * ```js
 * console.log(increment('foo/bar.txt', { platform: 'darwin' }));
 * //=> foo/bar copy.txt
 * console.log(increment('foo/bar.txt', { platform: 'linux' }));
 * //=> foo/bar (copy).txt
 * console.log(increment('foo/bar.txt', { platform: 'win32' }));
 * //=> foo/bar (2).txt
 * ```
 * @name increment
 * @param {String|Object} `file` If the file is an object, it must have a `path` property.
 * @param {Object} `options` See [available options](#options).
 * @return {String|Object} Returns a file of the same type that was given, with an increment added to the file name.
 * @api public
 */

const increment = (...args) => {
  return typeof args[0] === 'string' ? increment.path(...args) : increment.file(...args);
};

/**
 * Add a trailing increment to the given `filepath`.
 *
 * ```js
 * console.log(increment.path('foo/bar.txt', { platform: 'darwin' }));
 * //=> foo/bar copy.txt
 * console.log(increment.path('foo/bar.txt', { platform: 'linux' }));
 * //=> foo/bar (copy).txt
 * console.log(increment.path('foo/bar.txt', { platform: 'win32' }));
 * //=> foo/bar (2).txt
 * ```
 * @name .path
 * @param {String} `filepath`
 * @param {Object} `options` See [available options](#options).
 * @return {String}
 * @api public
 */

increment.path = (filepath, options = {}) => {
  return path.format(increment.file(path.parse(filepath), options));
};

/**
 * Add a trailing increment to the `file.base` of the given file object.
 *
 * ```js
 * console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'darwin' }));
 * //=> { path: 'foo/bar copy.txt', base: 'bar copy.txt' }
 * console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'linux' }));
 * //=> { path: 'foo/bar (copy).txt', base: 'bar (copy).txt' }
 * console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'win32' }));
 * //=> { path: 'foo/bar (2).txt', base: 'bar (2).txt' }
 * ```
 * @name .file
 * @param {String|Object} `file` If passed as a string, the path will be parsed to create an object using `path.parse()`.
 * @param {Object} `options` See [available options](#options).
 * @return {Object} Returns an object.
 * @api public
 */

increment.file = (file, options = {}) => {
  if (typeof file === 'string') {
    let temp = file;
    file = path.parse(file);
    file.path = temp;
  }

  file = { ...file };

  if (file.path && Object.keys(file).length === 1) {
    let temp = file.path;
    file = path.parse(file.path);
    file.path = temp;
  }

  if (file.dirname && !file.dir) file.dir = file.dirname;
  if (file.basename && !file.base) file.base = file.basename;
  if (file.extname && !file.ext) file.ext = file.extname;
  if (file.stem && !file.name) file.name = file.stem;

  let { start = 1, platform = process.platform } = options;
  let fn = options.increment || format[platform] || format.default;

  if (start === 1 && (platform === 'win32' || platform === 'windows')) {
    if (!options.increment) {
      start++;
    }
  }

  if (options.strip === true) {
    file.name = strip.increment(file.name, options);
    file.dir = strip.increment(file.dir, options);
    file.base = file.name + file.ext;
  }

  if (options.fs === true) {
    let name = file.name;
    let dest = path.format(file);

    while (fs.existsSync(dest)) {
      file.base = fn(name, start++) + file.ext;
      dest = path.format(file);
    }
  } else {
    file.base = fn(file.name, start) + file.ext;
  }

  file.path = path.join(file.dir, file.base);
  return file;
};

/**
 * Returns an ordinal-suffix for the given number. This is used
 * when creating increments for files on Linux.
 *
 * ```js
 * const { ordinal } = require('add-filename-increment');
 * console.log(ordinal(1)); //=> 'st'
 * console.log(ordinal(2)); //=> 'nd'
 * console.log(ordinal(3)); //=> 'rd'
 * console.log(ordinal(110)); //=> 'th'
 * ```
 * @name .ordinal
 * @param {Number} `num`
 * @return {String}
 * @api public
 */

increment.ordinal = ordinal;

/**
 * Returns an ordinal for the given number.
 *
 * ```js
 * const { toOrdinal } = require('add-filename-increment');
 * console.log(toOrdinal(1)); //=> '1st'
 * console.log(toOrdinal(2)); //=> '2nd'
 * console.log(toOrdinal(3)); //=> '3rd'
 * console.log(toOrdinal(110)); //=> '110th'
 * ```
 * @name .toOrdinal
 * @param {Number} `num`
 * @return {String}
 * @api public
 */

increment.toOrdinal = toOrdinal;
module.exports = increment;
