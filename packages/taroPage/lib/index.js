// 'use strict';
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
    //2下载项目模版至缓存目录
    await downloadTaroPage(taroPageTemplate)
    //3安装项目模版至项目目录
    await installTaroPage(taroPageTemplate, opts)
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