const increment = require('.');

console.log(increment('foo/bar.txt', { platform: 'darwin' })); //=> foo/bar copy.txt
console.log(increment('foo/bar.txt', { platform: 'linux' })); //=> foo/bar (copy).txt
console.log(increment('foo/bar.txt', { platform: 'win32' })); //=> foo/bar (2).txt

console.log(increment.path('foo/bar.txt', { platform: 'darwin' })); //=> foo/bar copy.txt
console.log(increment.path('foo/bar.txt', { platform: 'linux' })); //=> foo/bar (copy).txt
console.log(increment.path('foo/bar.txt', { platform: 'win32' })); //=> foo/bar (2).txt


console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'darwin' }));
//=> { path: 'foo/bar copy.txt', base: 'bar copy.txt' }
console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'linux' }));
//=> { path: 'foo/bar (copy).txt', base: 'bar (copy).txt' }
console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'win32' }));
//=> { path: 'foo/bar (2).txt', base: 'bar (2).txt' }

console.log(increment.ordinal(1)); //=> 'st'
console.log(increment.ordinal(2)); //=> 'nd'
console.log(increment.ordinal(3)); //=> 'rd'
console.log(increment.ordinal(110)); //=> 'th'

console.log(increment.toOrdinal(1)); //=> '1st'
console.log(increment.toOrdinal(2)); //=> '2nd'
console.log(increment.toOrdinal(3)); //=> '3rd'
console.log(increment.toOrdinal(110)); //=> '110th'
