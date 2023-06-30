
import path from 'node:path'
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra'
import ora from 'ora'
import { execa } from 'execa'
import { log, printErrorLog } from '@ftd-zf/utils'

/**
 * 下载npm模版
 * 下载的文件夹下需要安装node_modules目录，否则直接使用npm install 是下载不成功的
 */

function getCacheDir(targetPath) {
    return path.resolve(targetPath, 'node_modules')
}

function makeCacheDir(targetPath) {
    const cacheDir = getCacheDir(targetPath)
    if (!pathExistsSync(cacheDir)) {
        fse.mkdirpSync(cacheDir)//创建文件夹
    }
}

async function downloadAddTemplate(targetPath, taroComponentTemplate) {
    const { npmName, version } = taroComponentTemplate
    const installCommand = 'npm'
    const installArgs = ['install', `${npmName}@${version}`]
    const cwd = targetPath
    log.verbose('installArgs', installArgs)
    log.verbose('cwd', cwd)
    await execa(installCommand, installArgs, { cwd })

}

export default async function downloadTaroComponent(taroComponentTemplate) {
    const { targetPath, template } = taroComponentTemplate
    makeCacheDir(targetPath)
    const spinner = ora({
        text: '正在创建模版组件...',
        interval: 180, // Optional
        spinner: 'runner'
    }).start()
    try {
        await downloadAddTemplate(targetPath, template)
        spinner.stop()
        log.success('创建模版组件成功')

    } catch (error) {
        spinner.stop()
        printErrorLog(error)
    }
}