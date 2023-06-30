'use strict';

const taropage = require('..');
const assert = require('assert').strict;

assert.strictEqual(taropage(), 'Hello from taropage');
console.info('taropage tests passed');
