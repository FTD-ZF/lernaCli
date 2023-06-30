// 'use strict';
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
    //2下载项目模版至缓存目录
    await downloadTaroComponent(taroComponentTemplate)
    //3安装项目模版至项目目录
    await installTaroComponent(taroComponentTemplate, opts)
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