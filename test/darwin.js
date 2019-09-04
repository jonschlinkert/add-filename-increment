'use strict';

require('mocha');
const path = require('path');
const assert = require('assert').strict;
const increment = require('..');

const fixtures = (...args) => {
  return path.join(__dirname, 'fixtures', ...args).replace(/\\/g, '/');
};
const inc = (fp, opts) => {
  return increment(fixtures(fp), { ...opts, fs: true, platform: 'darwin' });
};

describe('darwin', () => {
  it('should not increment the filename when it does not exist', () => {
    assert.equal(inc('baz.txt'), fixtures('baz.txt'));
  });

  it('should increment the filename when it exists already', () => {
    assert.equal(inc('bar.txt'), fixtures('bar copy.txt'));
    assert.equal(inc('sub/foo.txt'), fixtures('sub/foo copy.txt'));
    assert.equal(inc('sub/nested/foo.txt'), fixtures('sub/nested/foo copy 2.txt'));
  });

  it('should strip existing increments and raw numbers before updating increment', () => {
    const opts = { strip: true, removeRawNumbers: true };
    assert.equal(inc('foo.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('qux 2.txt', opts), fixtures('qux copy.txt'));
    assert.equal(inc('abc (2) - Copy.txt', opts), fixtures('abc copy.txt'));
    assert.equal(inc('abc (2) - Copy Copy.txt', opts), fixtures('abc copy.txt'));
    assert.equal(inc('sub/nested/foo copy.txt', opts), fixtures('sub/nested/foo copy 2.txt'));
    assert.equal(inc('sub/nested/foo copy 2.txt', opts), fixtures('sub/nested/foo copy 2.txt'));
  });

  it('should strip existing increments before updating increment', () => {
    const opts = { strip: true };
    assert.equal(inc('foo.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo 2 copy.txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('qux 2.txt', opts), fixtures('qux 2 copy.txt'));
    assert.equal(inc('abc (2) - Copy.txt', opts), fixtures('abc copy.txt'));
    assert.equal(inc('abc (2) - Copy Copy.txt', opts), fixtures('abc copy.txt'));
    assert.equal(inc('sub/nested/foo copy.txt', opts), fixtures('sub/nested/foo copy 2.txt'));
    assert.equal(inc('sub/nested/foo copy 2.txt', opts), fixtures('sub/nested/foo copy 2.txt'));
  });

  it('should start at the given number', () => {
    // fixtures exist up to "6", so "7" is the lowest number we should see.
    assert.equal(inc('foo.txt', { start: 1 }), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo.txt', { start: 2 }), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo.txt', { start: 3 }), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo.txt', { start: 4 }), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo.txt', { start: 5 }), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo.txt', { start: 6 }), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo.txt', { start: 7 }), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo.txt', { start: 8 }), fixtures('foo copy 8.txt'));
    assert.equal(inc('foo.txt', { start: 101 }), fixtures('foo copy 101.txt'));
  });

  it('should not strip increments when disabled', () => {
    let opts = { strip: false };
    assert.equal(inc('foo.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo 2 copy.txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo copy copy.txt'));
  });

  it('should use a custom function to increment the file name', () => {
    let opts = {
      increment(stem, n) {
        return stem.replace(/(\s+copy\s*|\s\d+)$/, '') + ' copy ' + (n + 1);
      }
    };

    assert.equal(inc('foo.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo copy 7.txt'));
  });
});
