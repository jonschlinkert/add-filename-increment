// 'use strict';

// var origCwd = process.cwd();

// require('mocha');
// var path = require('path');
// var isWindows = require('is-windows')();
// var assert = require('assert');
// var File = require('vinyl');
// var increment = require('..');

// describe('increment-filename', function() {
//   before(function() {
//     process.chdir(path.join(__dirname, 'fixtures'));
//   });

//   after(function() {
//     process.chdir(origCwd);
//   });

//   describe('main export', function() {
//     it('should export a function', function() {
//       assert.equal(typeof increment, 'function');
//     });

//     it('should expose a `.file` method', function() {
//       assert.equal(typeof increment.file, 'function');
//     });

//     it('should throw an error when invalid args are passed', function() {
//       assert.throws(function() {
//         increment();
//       });
//     });
//   });

//   describe('darwin - same directory', function() {
//     it('should not increment the filename when it does not exist', function() {
//       if (isWindows) return this.skip();
//       assert.equal(increment('baz.txt', 'baz.txt'), 'baz.txt');
//     });

//     it('should add "copy" to the filename when copied to same dir', function() {
//       if (isWindows) return this.skip();
//       assert.equal(increment('bar.txt', 'bar.txt'), 'bar copy.txt');
//     });

//   });

//   describe('darwin - different directory', function() {
//     it('should increment the filename when the file already exists', function() {
//       if (isWindows) return this.skip();
//       assert.equal(increment('bar.txt', 'sub/bar.txt'), 'sub/bar 2.txt');
//     });
//   });

//   describe('options.stripIncrement', function() {
//     it.only('should add "copy" and increment the filename', function() {
//       if (isWindows) return this.skip();
//       assert.equal(increment('foo.txt', 'foo.txt'), 'foo copy 7.txt');
//       assert.equal(increment('foo 2.txt', 'foo 2.txt'), 'foo copy 7.txt');
//     });
//   });

//   // describe('darwin - increment.file (vinyl files)', function() {
//   //   it('should increment the filename when the file already exists', function() {
//   //     if (isWindows) return this.skip();
//   //     var file = new File({path: res('foo.txt')});
//   //     file.path = expected('foo.txt');
//   //     increment.file(file);

//   //     assert.equal(file.path, expected('foo (2).txt'));
//   //   });
//   // });

//   // describe('windows - increment filepath', function() {
//   //   it('should not increment when destPath does not exist', function() {
//   //     if (!isWindows) return this.skip();
//   //     assert.equal(increment(...args('baz.txt')), expected('baz.txt'));
//   //   });

//   //   it('should increment when destPath exists', function() {
//   //     if (!isWindows) return this.skip();
//   //     assert.equal(increment(...args('foo.txt')), expected('foo 2.txt'));
//   //     assert.equal(increment(...args('foo copy.txt')), expected('foo copy 2.txt'));
//   //   });
//   // });

//   // describe('windows - increment.file (vinyl files)', function() {
//   //   it('should increment when the file.path exists', function() {
//   //     if (!isWindows) return this.skip();
//   //     var file = new File({path: res('foo.txt')});
//   //     file.path = expected('foo.txt');
//   //     increment.file(file);

//   //     assert.equal(file.path, expected('foo (2).txt'));
//   //   });
//   // });
// });
