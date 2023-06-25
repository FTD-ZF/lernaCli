import log from 'npmlog'
import isDebug from './isDebug.js'

if (isDebug()) {
    log.level = 'verbose'
} else {
    log.level = 'info'
}
log.heading = 'FTDCli'
log.addLevel('success', 2000, { fg: 'green', bg: '', bold: true })

export default log