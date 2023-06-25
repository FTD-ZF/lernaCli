'use strict';

const generate = require('..');
const assert = require('assert').strict;

assert.strictEqual(generate(), 'Hello from generate');
console.info('generate tests passed');
