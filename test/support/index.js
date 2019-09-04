'use strict';

const fs = require('fs');
const path = require('path');
const increment = require('../..');

const generate = (dir, filenames, options = {}) => {
  let { start = 0, number = 1 } = options;
  let files = [];

  for (let filename of [].concat(filenames)) {
    let basepath = path.join(dir, filename);

    for (let i = start; i < number; i++) {
      let file = increment.path(basepath, { ...options, start: i });
      files.push(file);
    }
  }

  return files;
};

console.log(generate(__dirname, 'foo.txt', { start: 1, number: 20, platform: 'win32' }))
