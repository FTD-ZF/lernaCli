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
        text: '正在拷贝模版文件...',
        interval: 180, // Optional
        spinner: 'runner'
    }).start()
    fileList.map((file) => {
        fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)// 拷贝文件或文件夹
    })
    spinner.stop()
    log.success('模版拷贝成功')
    // if (template.value.indexOf('webpack4') != -1) {
    //     changePackageContent(installDir)
    // }
}

//修改packagejson中的内容
function changePackageContent(installDir) {

    const packageJsonDir = path.resolve(installDir + '/', 'package.json')

    fse.readFile(packageJsonDir, (err, data) => {
        log.verbose(data)
        if (!data) {
            return
        }

        let dataObj = JSON.parse(data)

        dataObj.devDependencies['webpack'] = '4.46.0'
        dataObj.devDependencies['@tarojs/mini-runner'] = '3.6.8'
        dataObj.devDependencies['@tarojs/webpack-runner'] = '3.6.8'

        delete dataObj.devDependencies['@tarojs/taro-loader']
        delete dataObj.devDependencies['@tarojs/webpack5-runner']

        fse.writeFile(packageJsonDir, JSON.stringify(dataObj, null, 2), (err) => {
            if (err) {
                log.error(err)
            }
        })

    })

}

export default function installTemplate(selectedTemplate, opts) {
    const { force = false } = opts
    const { targetPath, name, template } = selectedTemplate
    const rootDir = process.cwd()

    fse.ensureDirSync(targetPath)//确保目录存在 并创建文件夹
    const installDir = path.resolve(`${rootDir}/${name}`)
    if (pathExistsSync(installDir)) {
        if (!force) {
            log.error(`当前目录下已存在 ${installDir}文件夹`)
            return
        } else {
            fse.removeSync(installDir)
            fse.ensureDirSync(installDir)
        }
    } else {
        fse.ensureDirSync(installDir)
    }

    copyFile(targetPath, template, installDir)

}