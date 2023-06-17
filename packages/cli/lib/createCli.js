

import path from 'node:path'
import { program } from 'commander'
import semver from "semver"
import chalk from 'chalk'
import fse from 'fs-extra'
import { dirname } from 'dirname-filename-esm'
import { log, isDebug, } from '@ftd-zf/utils'


const __dirname = dirname(import.meta)
const pagPath = path.resolve(__dirname, '../package.json')
const pkg = fse.readJsonSync(pagPath)

const LOWEST_NODE_VERSION = '14.0.0'

function checkNodeVersion(params) {
    // log.verbose('node version', process.version)
    if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
        throw new Error(chalk.red(`需要安装${LOWEST_NODE_VERSION}以上版本的Node.js`))
    }
}

function preAction() {
    //检查node版本
    checkNodeVersion()
}

export default function createCli(params) {

    // log.info('version', pkg.version)
    program.name(Object.keys(pkg.bin)[0])
        .usage('<commander[options]>')
        .version(pkg.version)
        .option('-d,--debug', '是否开启调试模式', false)
        .hook('preAction', preAction)


    //监听
    program.on('command:*', function (obj) {
        log.error('未知的命令:' + obj[0])
    })
    program.on('option:debug', function (obj) {
        if (program.opts().debug) {
            log.verbose('debug', '启动debug模式')
        }
    })

    return program
}