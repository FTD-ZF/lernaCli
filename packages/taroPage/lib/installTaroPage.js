import path from 'node:path'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import ora from 'ora'
import { log } from '@ftd-zf/utils'


function getCacheFilePath(targetPath, template) {
    return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function copyFile(targetPath, template, installDir, addRemark) {

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
    writePageDirToConfig(installDir, addRemark)
}

//在taro项目中的app.config.js下写入对应的生成page的路径
function writePageDirToConfig(pageDir, addRemark) {
    log.verbose('====writePageDirToConfig===')
    log.verbose(pageDir)
    try {
        let root = process.cwd();//当前项目根目录
     
        log.verbose(root)

        const appDirArr = root.split(`pages`)

        const fileList = fse.readdirSync(appDirArr[0])//读取目录下 所有文件

        log.verbose(fileList)
        let appConfigDir = '';
        fileList.map((file) => {
            if (file.indexOf('app.config') != -1) {
                appConfigDir = `${appDirArr[0]}${file}`
            }
        })
        log.verbose(appConfigDir)

        //获取配置文件中需要的路径地址
        let newConfigDir = ''

        const strPages = path.normalize('\\pages\\')

        if (pageDir.indexOf(strPages) == -1) {
            const pageDirArr = pageDir.split(`src/`)
            newConfigDir = pageDirArr[1]
        } else {
            //windows下路径
            const resFirst = path.normalize(pageDir)
            log.verbose(resFirst)
            const splitStr = path.normalize(`\\pages\\`)
            log.verbose(splitStr)
            const arrFirst = resFirst.split(splitStr)
            log.verbose(arrFirst)
            const splitStra = path.normalize(`\\`)
            log.verbose(splitStra)
            if (!arrFirst[1]) {
                return
            }
            const resSecond = `pages\\` + arrFirst[1]
            log.verbose(resSecond)
            const arrSecond = path.normalize(resSecond).split(splitStra)

            log.verbose(arrSecond)

            arrSecond.map((item, index) => {
                newConfigDir = newConfigDir + item + (arrSecond.length == (index + 1) ? '' : '/')
            })
        }


        log.verbose(newConfigDir)
        if (!newConfigDir) {
            return
        }

        fse.readFile(appConfigDir, 'utf8', (err, data) => {
            log.verbose('==readFile==')
            log.verbose(err)
            log.verbose(data)

            let dataArr = data.split(/\r\n|\n|\r/gm)

            if ((dataArr[0].indexOf('defineAppConfig') != -1) && dataArr[1].indexOf('pages: [') != -1) {

                dataArr.splice(3, 0, `    '${newConfigDir + '/index'}',${'//' + addRemark}`)
                fse.writeFile(appConfigDir, dataArr.join('\r\n'), (err) => {
                    if (err) {
                        log.error(err)
                    }

                    const navDir = root + '/nav.js'//定义“跳转”的文件路径
                    log.verbose(navDir)
                    const navUrlContent = `'${newConfigDir + '/index'}'`//跳转url

                    const funcNameArr = newConfigDir.split('/')

                    const funcName = funcNameArr[funcNameArr.length - 1]

                    let firstUrl = ''

                    if (navDir.indexOf(strPages) == -1) {
                        const firstArr = navDir.split(`pages`)
                        firstUrl = firstArr[0] + 'pages/nav.js'

                    } else {
                        //windows下路径
                        const resFirst = path.normalize(navDir)
                        log.verbose(resFirst)
                        const splitStr = path.normalize(`\\pages\\`)
                        log.verbose(splitStr)
                        const arrFirst = resFirst.split(splitStr)
                        log.verbose(arrFirst)

                        firstUrl = arrFirst[0] + 'pages\\nav.js'
                        // log.verbose(splitStra)
                        // if (!arrFirst[1]) {
                        //     return
                        // }
                        // const resSecond = `pages\\` + arrFirst[1]
                        // log.verbose(resSecond)
                        // const arrSecond = path.normalize(resSecond).split(splitStra)

                        // log.verbose(arrSecond)

                        // arrSecond.map((item, index) => {
                        //     newConfigDir = newConfigDir + item + (arrSecond.length == (index + 1) ? '' : '/')
                        // })
                    }
                    log.verbose(firstUrl)
                    const params = {
                        firstUrl, navUrlContent, addRemark, funcName,
                    }

                    if (fse.pathExistsSync(firstUrl)) {
                        writeNavContent(params)
                    } else {
                        fse.ensureFileSync(firstUrl)
                        writeNavContent(params)
                    }

                })
            }
        })

    } catch (error) {
        log.error(error)
    }
}

// 写入'taro跳转方法'到指定文件
function writeNavContent(params) {
    log.verbose(params)
    const { firstUrl, navUrlContent, addRemark, funcName, } = params

    fse.readFile(firstUrl, 'utf8', (err, data) => {
        log.verbose('==readFile=writeNavContent=' + firstUrl)
        log.verbose(err)

        let dataArr = data.split(/\r\n|\n|\r/gm)

        if (dataArr.length == 1) {
            dataArr = []
        }

        const firstLineContent = `import Taro from "@tarojs/taro"`

        if (dataArr.indexOf(firstLineContent) == -1) {
            dataArr.push(firstLineContent)
        }

        let arrFuncName = funcName.split("");

        let newFuncName = ''
        arrFuncName.map((item, index) => {
            newFuncName = newFuncName + (index === 0 ? item.toUpperCase() : item)
        })
        log.verbose(newFuncName)
        const curNavUrlContent = insertStr(navUrlContent, 1, '/');
        log.verbose(curNavUrlContent)

        //代码模版
        const toWriteNavContent =
            `
/**
 * ${addRemark}
 */
export const Nav${newFuncName} = (params = '') => {
    Taro.navigateTo({
        url: ${curNavUrlContent} + params
    })
}`

        log.verbose(toWriteNavContent)
        dataArr.push(toWriteNavContent)

        fse.writeFile(firstUrl, dataArr.join('\r\n'), (err) => {
            if (err) {
                log.error(err)
            }

        })
    })
}
/**
 * 
 * @param {*} str 需要转化的内容
 * @param {*} index 需要插入的位置下标
 * @param {*} insertStr 插入内容
 * @returns 
 */
function insertStr(str, index, insertStr) {
    const ary = str.split('');		// 转化为数组
    ary.splice(index, 0, insertStr);	// 使用数组方法插入字符串
    return ary.join('');				// 拼接成字符串后输出
}

export default function installTaroPage(taroPageTemplate, opts) {

    const { targetPath, name, template, addRemark } = taroPageTemplate
    const rootDir = process.cwd()

    fse.ensureDirSync(targetPath)//确保目录存在 并创建文件夹
    const installDir = path.resolve(`${rootDir}/${name}`)
    if (pathExistsSync(installDir)) {

        fse.removeSync(installDir)
        fse.ensureDirSync(installDir)

    } else {
        fse.ensureDirSync(installDir)
    }

    copyFile(targetPath, template, installDir, addRemark)

}