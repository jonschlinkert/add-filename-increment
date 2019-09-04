'use strict';

require('mocha');
const assert = require('assert').strict;
const { ordinal, toOrdinal } = require('..');

describe('ordinals', () => {
  it('should return the ordinal suffix only', () => {
    assert.equal(ordinal(0), 'th');
    assert.equal(ordinal(1), 'st');
    assert.equal(ordinal(2), 'nd');
    assert.equal(ordinal(3), 'rd');
  });

  it('should append zero with "th"', () => {
    assert.equal(toOrdinal(0), '0th');
    assert.equal(toOrdinal(-0), '0th');
  });

  it('should append "st" to numbers ending with 1, accept for 11', () => {
    assert.equal(toOrdinal(1), '1st');
    assert.equal(toOrdinal(11), '11th');
    assert.equal(toOrdinal(21), '21st');
    assert.equal(toOrdinal(31), '31st');
    assert.equal(toOrdinal(41), '41st');
    assert.equal(toOrdinal(51), '51st');
    assert.equal(toOrdinal(61), '61st');
    assert.equal(toOrdinal(71), '71st');
    assert.equal(toOrdinal(81), '81st');
    assert.equal(toOrdinal(91), '91st');
    assert.equal(toOrdinal(111), '111th');
    assert.equal(toOrdinal(121), '121st');
    assert.equal(toOrdinal(211), '211th');
    assert.equal(toOrdinal(311), '311th');
    assert.equal(toOrdinal(321), '321st');
    assert.equal(toOrdinal(1111), '1111th');
    assert.equal(toOrdinal(10011), '10011th');
    assert.equal(toOrdinal(10111), '10111th');
  });

  it('should append "nd" to numbers ending in 2, accept for 12', () => {
    assert.equal(toOrdinal(2), '2nd');
    assert.equal(toOrdinal(12), '12th');
    assert.equal(toOrdinal(22), '22nd');
    assert.equal(toOrdinal(32), '32nd');
    assert.equal(toOrdinal(42), '42nd');
    assert.equal(toOrdinal(52), '52nd');
    assert.equal(toOrdinal(62), '62nd');
    assert.equal(toOrdinal(72), '72nd');
    assert.equal(toOrdinal(82), '82nd');
    assert.equal(toOrdinal(92), '92nd');
    assert.equal(toOrdinal(112), '112th');
    assert.equal(toOrdinal(212), '212th');
    assert.equal(toOrdinal(1012), '1012th');
    assert.equal(toOrdinal(10012), '10012th');
  });

  it('should append "rd" to numbers ending with 3, accept for 13', () => {
    assert.equal(toOrdinal('03'), '3rd');
    assert.equal(toOrdinal(3), '3rd');
    assert.equal(toOrdinal(13), '13th');
    assert.equal(toOrdinal(23), '23rd');
    assert.equal(toOrdinal(33), '33rd');
    assert.equal(toOrdinal(43), '43rd');
    assert.equal(toOrdinal(53), '53rd');
    assert.equal(toOrdinal(63), '63rd');
    assert.equal(toOrdinal(73), '73rd');
    assert.equal(toOrdinal(83), '83rd');
    assert.equal(toOrdinal(93), '93rd');
    assert.equal(toOrdinal(103), '103rd');
    assert.equal(toOrdinal(113), '113th');
    assert.equal(toOrdinal(123), '123rd');
    assert.equal(toOrdinal(213), '213th');
    assert.equal(toOrdinal(1013), '1013th');
    assert.equal(toOrdinal(10013), '10013th');
  });

  it('should work with negative numbers', () => {
    assert.equal(toOrdinal(-0), '0th');
    assert.equal(toOrdinal(-1), '-1st');
    assert.equal(toOrdinal(-2), '-2nd');
    assert.equal(toOrdinal(-3), '-3rd');
  });

  it('should throw a TypeError when NaN', () => {
    assert.throws(() => toOrdinal(NaN), TypeError);
  });
});
