
import { homedir } from 'node:os'
import path, { join } from 'node:path'
import fse from 'fs-extra'
import chalk from 'chalk'
import { log, makeList, makeInput, getLatestVersion, } from '@ftd-zf/utils'
import templateData from '@ftd-zf/data'

const ADD_TYPE_PROJECT = 'project'
const ADD_TYPE_PAGE = 'page'
const ADD_TEMPLATE = templateData
const ADD_TYPE = [
    {
        name: '项目',
        value: ADD_TYPE_PROJECT
    },
    {
        name: '页面',
        value: ADD_TYPE_PAGE
    }
]
const TEMP_HOME = '.ftd-cli'//缓存目录


//获取创建类型
function getAddType() {
    return makeList({
        choices: ADD_TYPE,
        message: '请选择初始化类型',
        defaultValue: ADD_TYPE_PROJECT,
    })
}
//获取项目名称
function getAddName() {
    return makeInput({
        message: '请输入项目名称',
        defaultValue: '',
        validate(v) {
            // console.log(v)
            if (v.length > 0) {
                return true
            }
            return '请输入项目名称'
        }
    })
}

//选择项目模版
function getAddTemplate(params) {
    return makeList({
        choices: ADD_TEMPLATE,
        message: '请选择项目模版'
    })
}

//安装缓存目录
function makeTargetPath(params) {
    // console.log(homedir())
    return path.resolve(`${homedir}/${TEMP_HOME}`, 'addTemplate')
}

export default async function createTemplate(name, opts) {

    const { type = null, template = null } = opts

    let addType;//创建的项目类型
    let addName;//创建的项目名称
    let selectTemplate;//创建的项目模版
    // if (type) {
    //     addType = type
    // } else {
    //     addType = await getAddType()
    // }


    // log.verbose('addType', addType)

    // if (addType === ADD_TYPE_PROJECT) {
    //项目模版
    if (template) {
        selectTemplate = ADD_TEMPLATE.find(tp => tp.value === template)
        if (!selectTemplate) {
            throw new Error(`项目模版 ${template} 不存在`)
        }
    } else {
        const addTemplate = await getAddTemplate()
        selectTemplate = ADD_TEMPLATE.find(_ => _.value === addTemplate)
    }
    //项目名称
    if (name) {
        addName = name
    } else {
        addName = await getAddName()
    }

    log.verbose('addName', addName)

    let root = process.cwd();//当前项目根目录
    if ((await fse.pathExists(join(root, addName)))) {
        return log.error(chalk.red(addName + '文件已经存在！'))
    }

    log.verbose('selectTemplate', selectTemplate)

    //获取最新版本号
    const latestVersion = await getLatestVersion(selectTemplate.npmName)
    selectTemplate.version = latestVersion
    const targetPath = makeTargetPath()
    return {
        // type: addType,
        name: addName,
        template: selectTemplate,
        targetPath,
    }
    // } else {
    //     throw new Error(`创建的项目类型 ${addType} 不支持`)
    // }

}