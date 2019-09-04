'use strict';

require('mocha');
const path = require('path');
const assert = require('assert').strict;
const increment = require('..');

const fixtures = (...args) => {
  return path.join(__dirname, 'fixtures', ...args).replace(/\\/g, '/');
};
const inc = (fp, opts) => {
  return increment(fixtures(fp), { ...opts, fs: true, platform: 'linux' });
};

describe('linux', () => {
  it('should not increment the filename when it does not exist', () => {
    assert.equal(inc('baz.txt'), fixtures('baz.txt'));
  });

  it('should increment the filename when it exists already', () => {
    assert.equal(inc('bar.txt'), fixtures('bar (copy).txt'));
    assert.equal(inc('sub/foo.txt'), fixtures('sub/foo (copy).txt'));
    assert.equal(inc('sub/nested/foo.txt'), fixtures('sub/nested/foo (copy).txt'));
  });

  it('should strip existing increments and raw numbers before updating increment', () => {
    let opts = { strip: true, removeRawNumbers: true };
    assert.equal(inc('foo.txt', opts), fixtures('foo (copy).txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo (copy).txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo (copy).txt'));
    assert.equal(inc('one (copy).txt', opts), fixtures('one (another copy).txt'));
    assert.equal(inc('qux 2.txt', opts), fixtures('qux (copy).txt'));
    assert.equal(inc('abc (2) - Copy.txt', opts), fixtures('abc (copy).txt'));
    assert.equal(inc('abc (2) - Copy Copy.txt', opts), fixtures('abc (copy).txt'));
    assert.equal(inc('sub/nested/foo copy.txt', opts), fixtures('sub/nested/foo (copy).txt'));
    assert.equal(inc('sub/nested/foo copy 2.txt', opts), fixtures('sub/nested/foo (copy).txt'));
  });

  it('should strip existing increments before updating increment', () => {
    let opts = { strip: true };
    assert.equal(inc('foo.txt', opts), fixtures('foo (copy).txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo 2 (copy).txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo (copy).txt'));
    assert.equal(inc('one (copy).txt', opts), fixtures('one (another copy).txt'));
    assert.equal(inc('qux 2.txt', opts), fixtures('qux 2 (copy).txt'));
    assert.equal(inc('abc (2) - Copy.txt', opts), fixtures('abc (copy).txt'));
    assert.equal(inc('abc (2) - Copy Copy.txt', opts), fixtures('abc (copy).txt'));
    assert.equal(inc('sub/nested/foo copy.txt', opts), fixtures('sub/nested/foo (copy).txt'));
    assert.equal(inc('sub/nested/foo copy 2.txt', opts), fixtures('sub/nested/foo (copy).txt'));
  });

  it('should start at the given number, or the next number that does not exist', () => {
    assert.equal(inc('baz.txt', { start: 0 }), fixtures('baz.txt'), 'baz does not exist');
    assert.equal(inc('bar.txt', { start: 0 }), fixtures('bar (copy).txt'), 'bar is in fixtures');
    assert.equal(inc('foo.txt', { start: 2 }), fixtures('foo (another copy).txt'), 'foo is in fixtures');
    assert.equal(inc('foo.txt', { start: 3 }), fixtures('foo (3rd copy).txt'));
    assert.equal(inc('foo.txt', { start: 4 }), fixtures('foo (4th copy).txt'));
    assert.equal(inc('foo.txt', { start: 5 }), fixtures('foo (5th copy).txt'));
    assert.equal(inc('foo.txt', { start: 6 }), fixtures('foo (6th copy).txt'));
    assert.equal(inc('foo.txt', { start: 7 }), fixtures('foo (7th copy).txt'));
    assert.equal(inc('foo.txt', { start: 8 }), fixtures('foo (8th copy).txt'));
    assert.equal(inc('foo.txt', { start: 9 }), fixtures('foo (9th copy).txt'));
    assert.equal(inc('foo.txt', { start: 10 }), fixtures('foo (10th copy).txt'));
    assert.equal(inc('foo.txt', { start: 11 }), fixtures('foo (11th copy).txt'));
    assert.equal(inc('foo.txt', { start: 12 }), fixtures('foo (12th copy).txt'));
    assert.equal(inc('foo.txt', { start: 13 }), fixtures('foo (13th copy).txt'));
    assert.equal(inc('foo.txt', { start: 14 }), fixtures('foo (14th copy).txt'));
    assert.equal(inc('foo.txt', { start: 112 }), fixtures('foo (112th copy).txt'));
    assert.equal(inc('foo.txt', { start: 1112 }), fixtures('foo (1112th copy).txt'));
    assert.equal(inc('foo.txt', { start: 22 }), fixtures('foo (22nd copy).txt'));
    assert.equal(inc('foo.txt', { start: 122 }), fixtures('foo (122nd copy).txt'));
    assert.equal(inc('foo.txt', { start: 1122 }), fixtures('foo (1122nd copy).txt'));
    assert.equal(inc('foo.txt', { start: 102 }), fixtures('foo (102nd copy).txt'));
    assert.equal(inc('foo.txt', { start: 103 }), fixtures('foo (103rd copy).txt'));
  });

  it('should not strip increments when disabled', () => {
    let opts = { stripIncrement: false };
    assert.equal(inc('foo.txt', opts), fixtures('foo (copy).txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo 2 (copy).txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo copy (copy).txt'));
  });

  it('should use a custom function to increment the file name', () => {
    let opts = {
      increment(stem, n) {
        return stem.replace(/\s\d+$/, '') + ' [copy ' + (n + 1) + ']';
      }
    };

    assert.equal(inc('foo.txt', opts), fixtures('foo [copy 2].txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo [copy 2].txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo copy [copy 2].txt'));
  });
});
