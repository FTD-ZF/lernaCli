import path, { join } from 'node:path'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import ora from 'ora'
import { log } from '@ftd-zf/utils'


function getCacheFilePath(targetPath, template) {
    return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

/**
 * 
 * @param {*} targetPath 模板文件路径
 * @param {*} template 模板文件信息
 * @param {*} installDir 下载路径
 * @param {*} addRemark 页面备注
 */
function copyFile(targetPath, template, pageList, projectPageRoot) {

    const originFile = getCacheFilePath(targetPath, template) //模版目录文件
    const fileList = fse.readdirSync(originFile)//读取目录下 所有文件

    const spinner = ora({
        text: '正在生成页面...',
        interval: 180, // Optional
        spinner: 'runner'
    }).start()

    pageList.map(async (item, index) => {

        let installDir = join(projectPageRoot, item.path)

        fileList.map((file) => {
            fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)// 拷贝文件或文件夹
        })
    })

    spinner.stop()
    log.success('页面生成成功')
    writePageDirToConfig(projectPageRoot, pageList)
}

//在taro项目中的app.config.js下写入对应的生成page的路径
function writePageDirToConfig(pageDir, pageList) {
    log.verbose('====writePageDirToConfig===')
    log.verbose(pageDir)
    try {

        const appDirArr = pageDir.split(`/pages`)
        log.verbose('===log.verbose(appDirArr)===')
        log.verbose(appDirArr)
        const fileList = fse.readdirSync(appDirArr[0])//读取目录下 所有文件

        log.verbose(fileList)
        let appConfigDir = '';
        fileList.map((file) => {
            if (file.indexOf('app.config') != -1) {

                appConfigDir = `${appDirArr[0]}/${file}`
            }
        })
        log.verbose('appConfigDir==' + appConfigDir)


        const strPages = path.normalize('\\pages')


        fse.readFile(appConfigDir, 'utf8', (err, data) => {
            //读取app.config.js文件,转为数组数据并插入新的路径
            log.verbose('==readFile==')
            log.verbose(err)
            log.verbose(data)

            let dataArr = data.split(/\r\n|\n|\r/gm)

            if ((dataArr[0].indexOf('defineAppConfig') != -1) && dataArr[1].indexOf('pages: [') != -1) {

                let curNewPageList = []
                pageList.map((item, index) => {
                    curNewPageList.push(`    '${'pages/' + item.path}/index',${'//' + item.description}`)
                })

                dataArr.splice(3, 0, ...curNewPageList)

                fse.writeFile(appConfigDir, dataArr.join('\r\n'), (err) => {
                    if (err) {
                        log.error(err)
                        return
                    }

                    let firstUrl = ''//nav.js文件路径

                    if (pageDir.indexOf(strPages) == -1) {
                        log.verbose('==macos下路径==')
                        const navDir = pageDir.split('pages')[0] + 'pages/nav.js'//定义“跳转”的文件路径
                        log.verbose('navDir====' + navDir)
                        // const firstArr = navDir.split(`pages`)
                        // firstUrl = firstArr[0] + 'pages/nav.js'
                        firstUrl = navDir
                    } else {
                        //windows下路径
                        log.verbose('==windows下路径==')
                        const navDir = pageDir.split('pages')[0] + '\\nav.js'//定义“跳转”的文件路径
                        log.verbose(navDir)
                        const resFirst = path.normalize(navDir)
                        log.verbose(resFirst)
                        const splitStr = path.normalize(`\\pages\\`)
                        log.verbose(splitStr)
                        const arrFirst = resFirst.split(splitStr)
                        log.verbose(arrFirst)

                        firstUrl = arrFirst[0] + '\\pages\\nav.js'
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
                    log.verbose('firstUrl===' + firstUrl)
                    const params = {
                        firstUrl,
                    }

                    if (fse.pathExistsSync(firstUrl)) {
                        writeNavContent(params, pageList)
                    } else {
                        fse.ensureFileSync(firstUrl)
                        writeNavContent(params, pageList)
                    }

                })
            }
        })

    } catch (error) {
        log.error(error)
    }
}

// 写入'taro跳转方法'到指定文件
async function writeNavContent(params, pageList) {
    log.verbose(JSON.stringify(params))
    const { firstUrl, } = params

    await fse.readFile(firstUrl, 'utf8', (err, data) => {
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
        pageList.map((item, index) => {
            const curNavUrlContent = `'${'/pages/' + item.path + '/index'}'`//跳转url


            const toWriteNavContent = getWriteNavContent({
                addRemark: item.description,
                newFuncName: getNavFuncName(dataArr, item.title),
                curNavUrlContent,
            })

            dataArr.push(toWriteNavContent)
        })

        fse.writeFile(firstUrl, dataArr.join('\r\n'), (err) => {
            if (err) {
                log.error(err)
            }

            toChangeGenerateStatus()//修改template.config.json文件中的generateStatus值
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
//写入跳转方法
function getWriteNavContent(params) {
    const { addRemark, newFuncName, curNavUrlContent } = params
    return `
/**
 * ${addRemark}
 */
export const Nav${newFuncName} = (params = '') => {
    Taro.navigateTo({
        url: ${curNavUrlContent} + params
    })
}`
}
//获取跳转方法名
function getNavFuncName(dataArr, funcName) {
    let arrFuncName = funcName.split("");

    let newFuncName = ''
    arrFuncName.map((item, index) => {
        newFuncName = newFuncName + (index === 0 ? item.toUpperCase() : item)
    })


    //判定是否有重复的方法
    let curCount = 0
    dataArr.length > 0 && dataArr.map((item, index) => {
        if (item.indexOf(`Nav${newFuncName}`) != -1) {
            curCount++
        }
    })

    //如果有重复的方法名,则在方法名后面加上_1,_2,_3...
    if (curCount > 0) {
        newFuncName = newFuncName + '_' + curCount
    }
    return newFuncName
}

//修改template.config.json文件中的generateStatus值
function toChangeGenerateStatus() {
    const root = process.cwd();//当前项目根目录

    fse.readFile(join(root, 'template.config.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // 解析JSON数据
        try {
            const obj = JSON.parse(data);

            // 修改数据
            obj.generateStatus.value = true; // 假设你要修改的是对象的someKey属性

            // 将修改后的对象转换回JSON字符串
            const updatedData = JSON.stringify(obj, null, 2);

            // 写回文件
            fse.writeFile(join(root, 'template.config.json'), updatedData, 'utf8', (writeErr) => {
                if (writeErr) {
                    log.error(writeErr)
                }
            });
        } catch (parseErr) {
            log.error(parseErr)
        }
    });

}

export default function installTaroPage(taroPageTemplate, pageList) {

    const { targetPath, template } = taroPageTemplate

    fse.ensureDirSync(targetPath)//确保目录存在 并创建文件夹

    const root = process.cwd();//当前项目根目录

    const projectPageRoot = join(root, '/src/pages')

    pageList.map(async (item, index) => {

        let installDir = join(projectPageRoot, item.path)

        if (pathExistsSync(installDir)) {
            fse.removeSync(installDir)
            fse.ensureDirSync(installDir)
        } else {
            fse.ensureDirSync(installDir)
        }
    })



    copyFile(targetPath, template, pageList, projectPageRoot)

}