import path from 'node:path'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import ora from 'ora'
import { log } from '@ftd-zf/utils'

function getCacheFilePath(targetPath, template) {
    return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function copyFile(targetPath, template, installDir) {

    const originFile = getCacheFilePath(targetPath, template) //模版目录文件
    const fileList = fse.readdirSync(originFile)//读取目录下 所有文件
    const spinner = ora({
        text: '正在拷贝模版页面...',
        interval: 180, // Optional
        spinner: 'runner'
    }).start()
    fileList.map((file) => {
        fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)// 拷贝文件或文件夹
    })
    spinner.stop()
    log.success('模版页面拷贝成功')
    writePageDirToConfig(installDir)
}

//在taro项目中的app.config.js下写入对应的生成page的路径
function writePageDirToConfig(pageDir) {
    try {
        let root = process.cwd();//当前项目根目录
        const dirArray = root.split(`src`)
        log.verbose(dirArray)
        const projectRootName = dirArray[0]
        log.verbose(projectRootName)

        const appConfigDir = path.resolve(projectRootName, 'src/app.config.js')//当前项目下，任意文件位置可以进入该配置文件

        //获取配置文件中需要的路径地址
        const pageDirArr = pageDir.split(`src/`)
        const newConfigDir = pageDirArr[1]

        if (!newConfigDir) {
            return
        }

        fse.readFile(appConfigDir, 'utf8', (err, data) => {
            log.verbose(data)

            let dataArr = data.split(/\r\n|\n|\r/gm)

            if ((dataArr[0].indexOf('defineAppConfig') != -1) && dataArr[1].indexOf('pages: [') != -1) {
                dataArr.splice(3, 0, `        '${newConfigDir}',`)
                fse.writeFile(appConfigDir, dataArr.join('\r\n'), (err) => {
                    if (err) {
                        log.error(err)
                    }

                })
            }
        })

    } catch (error) {
        log.error(error)
    }
}

export default function installTaroPage(taroPageTemplate, opts) {

    const { targetPath, name, template } = taroPageTemplate
    const rootDir = process.cwd()

    fse.ensureDirSync(targetPath)//确保目录存在 并创建文件夹
    const installDir = path.resolve(`${rootDir}/${name}`)
    if (pathExistsSync(installDir)) {

        fse.removeSync(installDir)
        fse.ensureDirSync(installDir)

    } else {
        fse.ensureDirSync(installDir)
    }

    copyFile(targetPath, template, installDir)

}