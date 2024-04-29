// 'use strict';
import path, { join } from 'node:path'
import fse from 'fs-extra'
import Command from '@ftd-zf/command'
import { log } from '@ftd-zf/utils'
import createTaroComponent from './createTaroComponent.js'
import downloadTaroComponent from './downloadTaroComponent.js'
import installTaroComponent from './installTaroComponent.js'

/**
 * 使用方式
 * ftdcli tarocomponent
 * 或者
 * ftdcli tarocomponent newpagename
 */
class TaroComponentCommand extends Command {

  get command() {
    return 'tarocomponent [name]'
  }
  get description() {
    return 'create taro component'
  }

  get options() {
    return [

    ]
  }

  async action([name, opts]) {
    // console.log('init', name, opts)
    //1生成页面模版
    const taroComponentTemplate = await createTaroComponent(name, opts)
    log.verbose('createTaroComponent', taroComponentTemplate)
    if (!taroComponentTemplate) {
      return
    }

    const cacheDirPackageJson = path.resolve(taroComponentTemplate.targetPath, 'node_modules', taroComponentTemplate.template.npmName, 'package.json')
    log.verbose('当前模版缓存package.json', cacheDirPackageJson)
    //判断缓存目录是否存在
    if (await fse.pathExists(cacheDirPackageJson)) {
      const cacheVersion = JSON.parse(fse.readFileSync(cacheDirPackageJson, 'utf-8')).version
      log.verbose('==当前缓存模版版本号==' + cacheVersion)
      //获取本地缓存模版下的版本号与最新版本对比，如果不一致则更新
      if (cacheVersion !== taroComponentTemplate.template.version) {
        //2下载项目模版至缓存目录
        await downloadTaroComponent(taroComponentTemplate)
        //3安装项目模版至项目目录
        await installTaroComponent(taroComponentTemplate, opts)
      } else {
        //3安装项目模版至项目目录
        await installTaroComponent(taroComponentTemplate, opts)
      }

    } else {
      //2下载项目模版至缓存目录
      await downloadTaroComponent(taroComponentTemplate)
      //3安装项目模版至项目目录
      await installTaroComponent(taroComponentTemplate, opts)
    }

  }

  preAction() {
    // console.log('pre')
  }

  postAction() {
    // console.log('post')
  }
}

function TaroComponent(instance) {
  return new TaroComponentCommand(instance)
}

export default TaroComponent