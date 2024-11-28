// 'use strict';
import path, { join } from 'node:path'
import fse from 'fs-extra'
import chalk from 'chalk'
import inquirer from 'inquirer'
import Command from '@ftd-zf/command'
import { log } from '@ftd-zf/utils'
import createTaroPage from './createTaroPage.js'
import downloadTaroPage from './downloadTaroPage.js'
import installTaroPage from './installTaroPage.js'

/**
 * 使用方式
 * ftdcli taropage
 * 或者
 * ftdcli taropage newpagename
 */
let a = ''
class TaroAllPageCommand extends Command {

    get command() {
        return 'taropage-all'
    }
    get description() {
        return '根据配置文件，生成所有Taro页面'
    }

    get options() {
        return [

        ]
    }


    // 递归处理所有项，返回一个不包含children属性的数组
    processItemsWithoutChildren = (items, parentPath = '') => {
        let result = [];

        items.forEach(item => {
            // 构建当前项的完整路径
            const currentPath = parentPath ? `${parentPath}/${item.title}` : item.title;

            // 创建当前项的新对象（不包含children属性），并添加path属性
            const newItem = { title: item.title, description: item.description, path: currentPath };

            // 将新对象添加到结果数组中
            result.push(newItem);

            // 如果当前项有子项，则递归处理子项，并将结果合并到当前结果数组中
            if (item.children && item.children.length > 0) {
                result = result.concat(this.processItemsWithoutChildren(item.children, currentPath));
            }
        });

        return result;
    }

    action() {

        inquirer.prompt([
            {
                type: 'confirm',
                name: 'value',
                message: '先确认template.page.json文件是否配置正确，是否继续？',
                default: false,
            }
        ]).then(answers => {

            if (answers.value) {
                this.continueAction()
            } else {
                console.log('已取消');
            }
        });

    }

    async continueAction() {
        const root = process.cwd();//当前项目根目录

        if (!(await fse.pathExists(join(root, 'template.page.json')))) {
            return log.error(chalk.red('template.page.json 文件不存在！'))
        }

        const pageJsonData = await fse.readJson(join(root, 'template.page.json'));

        const pageList = this.processItemsWithoutChildren(pageJsonData)

        if (!pageList || pageList.length == 0) {
            log.warn(chalk.red('请配置template.page.json文件！'))
            return
        }

        if (!(await fse.pathExists(join(root, 'template.config.json')))) {
            return log.error(chalk.red('template.config.json 文件不存在！'))
        }

        const templateConfigData = await fse.readJson(join(root, 'template.config.json'));

        if (templateConfigData.generateStatus.value) {
            log.warn(chalk.red('已经使用过taropage-all命令，无法再次使用！'))
            return
        }

        //1生成页面模版
        const taroPageTemplate = await createTaroPage()

        if (!taroPageTemplate) {
            return
        }

        const cacheDirPackageJson = path.resolve(taroPageTemplate.targetPath, 'node_modules', taroPageTemplate.template.npmName, 'package.json')

        //判断缓存目录是否存在
        if (await fse.pathExists(cacheDirPackageJson)) {

            const cacheVersion = JSON.parse(fse.readFileSync(cacheDirPackageJson, 'utf-8')).version
            log.verbose('==当前缓存模版版本号==' + cacheVersion)
            //获取本地缓存模版下的版本号与最新版本对比，如果不一致则更新
            if (cacheVersion !== taroPageTemplate.template.version) {

                //2下载项目模版至缓存目录
                await downloadTaroPage(taroPageTemplate)
                //3安装项目模版至项目目录
                await installTaroPage(taroPageTemplate, pageList)
            } else {

                //3安装项目模版至项目目录
                await installTaroPage(taroPageTemplate, pageList)
            }

        } else {

            //2下载项目模版至缓存目录
            await downloadTaroPage(taroPageTemplate)
            //3安装项目模版至项目目录
            await installTaroPage(taroPageTemplate, pageList)
        }
    }



    preAction() {
        // console.log('pre')
    }

    postAction() {
        // console.log('post')
    }
}

function TaroPageALL(instance) {
    return new TaroAllPageCommand(instance)
}

export default TaroPageALL