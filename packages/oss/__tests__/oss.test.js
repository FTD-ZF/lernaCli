'use strict';

const oss = require('..');
const assert = require('assert').strict;

assert.strictEqual(oss(), 'Hello from oss');
console.info('oss tests passed');
