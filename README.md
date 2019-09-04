# add-filename-increment [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=W8YFZ425KND68) [![NPM version](https://img.shields.io/npm/v/add-filename-increment.svg?style=flat)](https://www.npmjs.com/package/add-filename-increment) [![NPM monthly downloads](https://img.shields.io/npm/dm/add-filename-increment.svg?style=flat)](https://npmjs.org/package/add-filename-increment) [![NPM total downloads](https://img.shields.io/npm/dt/add-filename-increment.svg?style=flat)](https://npmjs.org/package/add-filename-increment) [![Build Status](https://travis-ci.org/jonschlinkert/add-filename-increment.svg?branch=master)](https://travis-ci.org/jonschlinkert/add-filename-increment)

> When copying or moving files, it's common for operating systems to automatically add an increment or 'copy' to duplicate file names. This does that for Node.js applications, with automatic platform detection and support for Linux, MacOs, and Windows conventions.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/) (requires [Node.js](https://nodejs.org/en/) >=8):

```sh
$ npm install --save add-filename-increment
```

## What does this do?

When copying files, it's common for operating systems to append a numerical increment or the word 'copy' to a file name to prevent the existing file from being overwritten.

This library allows you to do the same thing in your Node.js application, using the correct conventions for the most commonly used [operating systems](#operating-systems).

## Usage

All methods automatically detect the platform to use, unless `platform` is defined on the [options](#options).

```js
const increment = require('add-filename-increment');
```

## API

### [increment](index.js#L54)

The main export is a function that adds a trailing increment to
the `stem` (basename without extension) of the given file path or object.

**Params**

* `file` **{String|Object}**: If the file is an object, it must have a `path` property.
* `options` **{Object}**: See [available options](#options).
* `returns` **{String|Object}**: Returns a file of the same type that was given, with an increment added to the file name.

**Example**

```js
console.log(increment('foo/bar.txt', { platform: 'darwin' }));
//=> foo/bar copy.txt
console.log(increment('foo/bar.txt', { platform: 'linux' }));
//=> foo/bar (copy).txt
console.log(increment('foo/bar.txt', { platform: 'win32' }));
//=> foo/bar (2).txt
```

### [.path](index.js#L76)

Add a trailing increment to the given `filepath`.

**Params**

* `filepath` **{String}**
* `options` **{Object}**: See [available options](#options).
* `returns` **{String}**

**Example**

```js
console.log(increment.path('foo/bar.txt', { platform: 'darwin' }));
//=> foo/bar copy.txt
console.log(increment.path('foo/bar.txt', { platform: 'linux' }));
//=> foo/bar (copy).txt
console.log(increment.path('foo/bar.txt', { platform: 'win32' }));
//=> foo/bar (2).txt
```

### [.file](index.js#L98)

Add a trailing increment to the `file.base` of the given file object.

**Params**

* `file` **{String|Object}**: If passed as a string, the path will be parsed to create an object using `path.parse()`.
* `options` **{Object}**: See [available options](#options).
* `returns` **{Object}**: Returns an object.

**Example**

```js
console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'darwin' }));
//=> { path: 'foo/bar copy.txt', base: 'bar copy.txt' }
console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'linux' }));
//=> { path: 'foo/bar (copy).txt', base: 'bar (copy).txt' }
console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'win32' }));
//=> { path: 'foo/bar (2).txt', base: 'bar (2).txt' }
```

### [.ordinal](index.js#L166)

Returns an ordinal-suffix for the given number. This is used when creating increments for files on Linux.

**Params**

* `num` **{Number}**
* `returns` **{String}**

**Example**

```js
const { ordinal } = require('add-filename-increment');
console.log(ordinal(1)); //=> 'st'
console.log(ordinal(2)); //=> 'nd'
console.log(ordinal(3)); //=> 'rd'
console.log(ordinal(110)); //=> 'th'
```

### [.toOrdinal](index.js#L184)

Returns an ordinal for the given number.

**Params**

* `num` **{Number}**
* `returns` **{String}**

**Example**

```js
const { toOrdinal } = require('add-filename-increment');
console.log(toOrdinal(1)); //=> '1st'
console.log(toOrdinal(2)); //=> '2nd'
console.log(toOrdinal(3)); //=> '3rd'
console.log(toOrdinal(110)); //=> '110th'
```

## Options

### options.fs

**Description**: Check the file system, and automatically increment the file based on existing files. Thus, if the file name is `foo.txt`, and `foo (2).txt` already exists, the file will automatically be renamed to `foo (3).txt`.

Also uses the correct conventions for Linux, Windows (win32), and MacOS (darwin).

**Type**: `boolean`

**Default**: `undefined`

### options.increment

**Description**: Custom function to handling incrementing a file name. This is mostly useful when `options.fs` is also defined, since this function will only be called if a file name needs to be incremented, allowing you to control how incrementing is done.

**Type**: `function`

**Default**: `undefined`

### options.platform

**Description**: Specify the platform conventions to use.

**Type**: `string`

**Default**: Uses `process.platform`. Valid values are `linux`, `win32`, and `darwin`.

## Operating Systems

* [Linux](#linux)
* [MacOS](#macos)
* [Windows](#windows)

**Supported Operating Systems**

Currently Windows, Darwin (MacOS), and Linux are supported. This library attempts to automatically use the correct conventions for each operating system. Please [create an issue](../../issues/new) if you ecounter a bug.

If you use an operating system with different conventions, and you would like for this library to add support, please [create an issue](../../issues/new) with a detailed description of those conventions, or feel free to do a [pull request](.github/contributing.md).

### Linux

When a file is copied or moved, and the destination file path already exists, Linux uses the following conventions for incrementing the file name.

| **Source path** | **Destination path** | **Type** | **Directory<sup>1</sup>** |
| --- | --- | --- | --- |
| `foo.txt` | `foo (copy).txt`, `foo (another copy).txt`, `foo (3rd copy).txt`, ... | file | Same directory as source |
| `foo` | `foo (copy)`, `foo (another copy)`, `foo (3rd copy)`, ... | directory | Same directory as source |

<small><sup>1</sup> _On Linux, when a file or folder is copied or moved to a different directory and another file or folder with the same name exists in that directory, you are prompted to choose a new name for the file or folder, or to cancel or skip the operation._ </small>

### MacOS

When a file is copied or moved, and the destination file path already exists, MacOS uses the following conventions for incrementing the file name.

| **Source path** | **Destination path** | **Type** | **Directory<sup>1</sup>** |
| --- | --- | --- | --- |
| `foo.txt` | `foo copy.txt`, `foo copy 2.txt`, ... | file | Same directory as source |
| `foo.txt` | `foo 2.txt`, `foo 3.txt`, ... | file | Different directory than source |
| `foo` | `foo copy`, `foo copy 2`, ... | directory | Same directory as source |

<small><sup>1</sup> _MacOS uses different conventions for incrementing file names when the source file is copied, moved or renamed to a different directory, versus when the file is copied into the same directory._ </small>

### Windows

When a file is copied or moved, and the destination file path already exists, Windows uses the following conventions for incrementing the file name.

| **Source path** | **Destination path** | **Type** | **Directory<sup>1</sup>** |
| --- | --- | --- | --- |
| `foo.txt` | `foo - Copy.txt` | file | Same directory as source |
| `foo.txt` | `foo (2).txt` | file | Different directory than source |
| `foo (2).txt` | `foo (3).txt` | file | Different directory than source |
| `foo` | `foo - Copy` | directory | Same directory as source |
| `foo - Copy` | `foo - Copy (2)` | directory | Same directory as source |

<small><sup>1</sup> _Windows uses different conventions for incrementing file names when the source file is copied, moved or renamed to a different directory, versus when the file is copied into the same directory. Also, when a folder is copied to a new directory, and the new directory already has a folder with the same name, Windows just merges the folders automatically._ </small>

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [micromatch](https://www.npmjs.com/package/micromatch): Glob matching for javascript/node.js. A replacement and faster alternative to minimatch and multimatch. | [homepage](https://github.com/micromatch/micromatch "Glob matching for javascript/node.js. A replacement and faster alternative to minimatch and multimatch.")
* [strip-filename-increment](https://www.npmjs.com/package/strip-filename-increment): Operating systems commonly add a trailing increment, or the word 'copy', or something similar to… [more](https://github.com/jonschlinkert/strip-filename-increment) | [homepage](https://github.com/jonschlinkert/strip-filename-increment "Operating systems commonly add a trailing increment, or the word 'copy', or something similar to duplicate files. This strips those increments. Tested on Windows, MacOS, and Linux.")
* [write](https://www.npmjs.com/package/write): Write data to a file, replacing the file if it already exists and creating any… [more](https://github.com/jonschlinkert/write) | [homepage](https://github.com/jonschlinkert/write "Write data to a file, replacing the file if it already exists and creating any intermediate directories if they don't already exist. Thin wrapper around node's native fs methods.")

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright © 2019, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.8.0, on September 04, 2019._