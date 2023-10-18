
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

//获取项目名称
function getAddName() {
    return makeInput({
        message: '请输入创建页面名称',
        defaultValue: '',
        validate(v) {
            if (v.length > 0) {
                return true
            }
            return '请输入创建页面名称'
        }
    })
}
//添加备注内容
function getAddRemark() {
    return makeInput({
        message: '请输入页面描述',
        defaultValue: '',
        // validate(v) {
        //     if (v.length > 0) {
        //         return true
        //     }
        //     return '请输入创建组件名称'
        // }
    })
}

//安装缓存目录
function makeTargetPath() {
    return path.resolve(`${homedir}/${TEMP_HOME}`, 'addPage')
}

export default async function createTaroPage(name, opts) {

    let addName;//创建的项目名称

    //项目名称
    if (name) {
        addName = name
    } else {
        addName = await getAddName()
    }



    let root = process.cwd();//当前项目根目录
    log.verbose(root)
    if ((await fse.pathExists(join(root, addName)))) {
        return log.error(chalk.red(addName + '文件已经存在！'))
    }
    if (root.indexOf('pages') == -1) {
        return log.error(chalk.red('Taro页面需要在pages文件下生成！'))
    }
    const addRemark = await getAddRemark()
    log.verbose('addRemark', addRemark)
    log.verbose('addName', addName)

    //获取最新版本号
    const latestVersion = await getLatestVersion(pageTemplate.npmName)
    pageTemplate.version = latestVersion
    const targetPath = makeTargetPath()
    return {
        name: addName,
        targetPath,
        template: pageTemplate,
        addRemark: addRemark,
    }

}