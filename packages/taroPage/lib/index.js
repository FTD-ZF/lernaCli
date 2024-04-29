// 'use strict';
import path, { join } from 'node:path'
import fse from 'fs-extra'
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
class TaroPageCommand extends Command {

  get command() {
    return 'taropage [name]'
  }
  get description() {
    return 'create taro page'
  }

  get options() {
    return [

    ]
  }

  async action([name, opts]) {
    // console.log('init', name, opts)
    //1生成页面模版
    const taroPageTemplate = await createTaroPage(name, opts)
    log.verbose('createTaroPage', taroPageTemplate)
    if (!taroPageTemplate) {
      return
    }

    const cacheDirPackageJson = path.resolve(taroPageTemplate.targetPath, 'node_modules', taroPageTemplate.template.npmName, 'package.json')
    log.verbose('当前模版缓存package.json', cacheDirPackageJson)
    //判断缓存目录是否存在
    if (await fse.pathExists(cacheDirPackageJson)) {
      const cacheVersion = JSON.parse(fse.readFileSync(cacheDirPackageJson, 'utf-8')).version
      log.verbose('==当前缓存模版版本号==' + cacheVersion)
      //获取本地缓存模版下的版本号与最新版本对比，如果不一致则更新
      if (cacheVersion !== taroPageTemplate.template.version) {
        //2下载项目模版至缓存目录
        await downloadTaroPage(taroPageTemplate)
        //3安装项目模版至项目目录
        await installTaroPage(taroPageTemplate, opts)
      } else {
        //3安装项目模版至项目目录
        await installTaroPage(taroPageTemplate, opts)
      }

    } else {
      //2下载项目模版至缓存目录
      await downloadTaroPage(taroPageTemplate)
      //3安装项目模版至项目目录
      await installTaroPage(taroPageTemplate, opts)
    }

  }

  preAction() {
    // console.log('pre')
  }

  postAction() {
    // console.log('post')
  }
}

function TaroPage(instance) {
  return new TaroPageCommand(instance)
}

export default TaroPage