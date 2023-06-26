import createInitCommand from '@ftd-zf/init'
import createGenerateCommand from '@ftd-zf/generate'
import createUploadOSSCommand from '@ftd-zf/oss'
import createCli from './createCli.js'

import './exception.js'

export default function (args) {

    const program = createCli()
    createInitCommand(program)
    createGenerateCommand(program)
    createUploadOSSCommand(program)

    program.parse(process.args)
}