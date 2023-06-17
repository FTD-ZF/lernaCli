


import { log, isDebug, } from '@ftd-zf/utils'

function printErrorLog(e, type) {
    if (isDebug()) {
        log.error(type, e)
    } else {
        log.error(type, e.message)
    }
}


process.on('uncaughtException', (e) => printErrorLog(e, 'error'))

process.on('unHandledRejection', (e) => printErrorLog(e, 'promise'))
