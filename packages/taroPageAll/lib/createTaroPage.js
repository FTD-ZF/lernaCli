
import { homedir } from 'node:os'
import path, { join } from 'node:path'
import fse from 'fs-extra';
import chalk from 'chalk';
import { log, makeList, makeInput, getLatestVersion, } from '@ftd-zf/utils'

const TEMP_HOME = '.ftd-cli'//缓存目录

const pageTemplate = {
    name: 'Taro页面生成',
    npmName: '@ftd-zf/taro-page-template',
    value: 'taro-page-template',
    version: '1.0.0'
}

//安装缓存目录
function makeTargetPath() {
    return path.resolve(`${homedir}/${TEMP_HOME}`, 'addPage')
}

export default async function createTaroPage() {

    let root = process.cwd();//当前项目根目录
    log.verbose(root)
    //获取最新版本号
    const latestVersion = await getLatestVersion(pageTemplate.npmName)
    pageTemplate.version = latestVersion
    const targetPath = makeTargetPath()
    return {
        targetPath,
        template: pageTemplate,
    }

}