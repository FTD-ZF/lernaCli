
import { homedir } from 'node:os'
import path, { join } from 'node:path'
import fse from 'fs-extra';
import chalk from 'chalk';
import { log, makeList, makeInput, getLatestVersion, } from '@ftd-zf/utils'

const TEMP_HOME = '.ftd-cli'//缓存目录

const taroComponentTemplate = {
    name: 'Taro组件生成',
    npmName: '@ftd-zf/taro-component-template',
    value: 'taro-component-template',
    version: '1.0.0'
}

//获取项目名称
function getAddName() {
    return makeInput({
        message: '请输入创建组件名称',
        defaultValue: '',
        validate(v) {
            if (v.length > 0) {
                return true
            }
            return '请输入创建组件名称'
        }
    })
}

//安装缓存目录
function makeTargetPath() {
    return path.resolve(`${homedir}/${TEMP_HOME}`, 'addTaroComponent')
}

export default async function createTaroComponent(name, opts) {

    let addName;//创建的项目名称

    //项目名称
    if (name) {
        addName = name
    } else {
        addName = await getAddName()
    }

    let root = process.cwd();//当前项目根目录

    if ((await fse.pathExists(join(root, addName)))) {
        return log.error(chalk.red(addName + '文件已经存在！'))
    }

    log.verbose('addName', addName)

    //获取最新版本号
    const latestVersion = await getLatestVersion(taroComponentTemplate.npmName)
    taroComponentTemplate.version = latestVersion
    const targetPath = makeTargetPath()
    return {
        name: addName,
        targetPath,
        template: taroComponentTemplate,
    }

}