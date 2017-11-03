'use strict';

var origCwd = process.cwd();

require('mocha');
var path = require('path');
var isWindows = require('is-windows')();
var assert = require('assert');
var File = require('vinyl');
var increment = require('..');

function sameDir(name, options) {
  return increment(name, name, options);
}

function otherDir(a, b, options) {
  return increment(a, b, options);
}

describe('darwin', function() {
  before(function() {
    process.chdir(path.join(__dirname, 'fixtures'));
  });

  after(function() {
    process.chdir(origCwd);
  });

  describe('main export', function() {
    it('should export a function', function() {
      assert.equal(typeof increment, 'function');
    });

    it('should expose a `.file` method', function() {
      assert.equal(typeof increment.file, 'function');
    });

    it('should throw an error when invalid args are passed', function() {
      assert.throws(function() {
        increment();
      });
    });
  });

  describe('increment', function() {
    it('should not increment the filename when it does not exist', function() {
      if (isWindows) return this.skip();
      assert.equal(sameDir('baz.txt'), 'baz.txt');
    });

    it('should increment the filename', function() {
      if (isWindows) return this.skip();
      assert.equal(sameDir('bar.txt'), 'bar 2.txt');
      assert.equal(sameDir('qux 2.txt'), 'qux 3.txt');
      assert.equal(otherDir('bar.txt', 'sub/bar.txt'), 'sub/bar 2.txt');
      assert.equal(otherDir('foo.txt', 'sub/foo.txt'), 'sub/foo 2.txt');
      assert.equal(otherDir('foo.txt', 'sub/nested/foo.txt'), 'sub/nested/foo 2.txt');
      assert.equal(otherDir('foo copy.txt', 'sub/nested/foo.txt'), 'sub/nested/foo 2.txt');
      assert.equal(otherDir('foo 2.txt', 'sub/nested/foo.txt'), 'sub/nested/foo 2.txt');
      assert.equal(otherDir('foo copy.txt', 'sub/nested/foo copy.txt'), 'sub/nested/foo 2.txt');
      assert.equal(otherDir('foo copy.txt', 'sub/nested/bar copy.txt'), 'sub/nested/bar 2.txt');
      assert.equal(otherDir('qux 2.txt', 'sub/nested/qux 2.txt'), 'sub/nested/qux 3.txt');
    });
  });

  describe('options.stripIncrement', function() {
    it('should add "copy" and increment the filename', function() {
      if (isWindows) return this.skip();
      var opts = { stripIncrement: false };
      assert.equal(sameDir('foo.txt', opts), 'foo 3.txt');
      assert.equal(sameDir('foo 2.txt', opts), 'foo 2 3.txt');
      assert.equal(sameDir('foo copy.txt', opts), 'foo copy 7.txt');
    });
  });

  describe('options.increment', function() {
    it('should add "copy" and increment the filename', function() {
      if (isWindows) return this.skip();
      var opts = {
        increment: function(stem, num) {
          return stem.replace(/\s\d+$/, '') + ' copy ' + num;
        }
      };

      assert.equal(sameDir('foo.txt', opts), 'foo copy 7.txt');
      assert.equal(sameDir('foo 2.txt', opts), 'foo copy 7.txt');
      assert.equal(sameDir('foo copy.txt', opts), 'foo copy 7.txt');
    });
  });
});
