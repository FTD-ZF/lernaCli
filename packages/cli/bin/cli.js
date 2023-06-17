#!/usr/bin/env node

import importLocal from 'import-local'
import { filename } from 'dirname-filename-esm'
import { fileURLToPath } from 'node:url'
import { log } from '@ftd-zf/utils'
import entry from '../lib/index.js'

// const __filename = fileURLToPath(import.meta.url)
const __filename = filename(import.meta)

if (importLocal(__filename)) {
  log.info('cli', '使用本地cli')
} else {
  entry(process.argv.slice(2))
}