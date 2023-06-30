import path from 'node:path'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import ora from 'ora'
import { log } from '@ftd-zf/utils'

function getCacheFilePath(targetPath, template) {
    return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function copyFile(targetPath, template, installDir, dirName) {

    const originFile = getCacheFilePath(targetPath, template) //模版目录文件
    const fileList = fse.readdirSync(originFile)//读取目录下 所有文件
   
    const spinner = ora({
        text: '正在拷贝模版组件...',
        interval: 180, // Optional
        spinner: 'runner'
    }).start()
    fileList.map((file) => {
        fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)// 拷贝文件或文件夹
    })
    spinner.stop()
    log.success('模版组件拷贝成功')
    changeComponentName(installDir, dirName)
}

//修改组件名称
function changeComponentName(pageDir, dirName) {
    try {
        log.verbose(pageDir)

        if (dirName) {
            //将首字母大写
            let arr = dirName.split("");

            let newDirName = ''
            arr.map((item, index) => {
                newDirName = newDirName + (index === 0 ? item.toUpperCase() : item)
            })

            const appConfigDir = path.resolve(pageDir + '/', 'index.js')

            fse.readFile(appConfigDir, 'utf8', (err, data) => {
                log.verbose(data)

                if (!data) {
                    return
                }

                const newData = data.replaceAll('TaroComponentName', newDirName)

                fse.writeFile(appConfigDir, newData, (err) => {
                    if (err) {
                        log.error(err)
                    }
                })

            })
        }
    } catch (error) {
        log.error(error)
    }
}

export default function installTaroComponent(taroComponentTemplate, opts) {

    const { targetPath, name, template } = taroComponentTemplate
    const rootDir = process.cwd()

    fse.ensureDirSync(targetPath)//确保目录存在 并创建文件夹
    const installDir = path.resolve(`${rootDir}/${name}`)
    if (pathExistsSync(installDir)) {

        fse.removeSync(installDir)
        fse.ensureDirSync(installDir)

    } else {
        fse.ensureDirSync(installDir)
    }

    copyFile(targetPath, template, installDir, name)

}