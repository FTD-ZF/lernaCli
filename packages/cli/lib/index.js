import createInitCommand from '@ftd-zf/init'
import createGenerateCommand from '@ftd-zf/generate'
import createUploadOSSCommand from '@ftd-zf/oss'
import createTaroPageCommand from '@ftd-zf/taropage'
import createTaroComponentCommand from '@ftd-zf/tarocomponent'
import createCli from './createCli.js'

import './exception.js'

export default function (args) {

    const program = createCli()
    createInitCommand(program)
    createTaroPageCommand(program)
    createTaroComponentCommand(program)
    createGenerateCommand(program)
    createUploadOSSCommand(program)

    program.parse(process.args)
}