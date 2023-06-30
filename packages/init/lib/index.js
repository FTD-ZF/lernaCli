// 'use strict';

import Command from '@ftd-zf/command'
import { log } from '@ftd-zf/utils'
import createTemplate from './createTemplate.js'
import downloadTemplate from './downloadTemplate.js'
import installTemplate from './installTemplate.js'

/**
 * 使用方式
 * ftdcli init
 * 或者
 * ftdcli init testProj  -tp template-vue3 --force 
 */
class InitCommand extends Command {

  get command() {
    return 'init [name]'
  }
  get description() {
    return 'init project'
  }

  get options() {
    return [
      ['-f,--force', '是否更新', false],
      ['-tp,--template <template>', '模版名称',],
      // ['-t,--type <type>', '项目类型（值：project/page）',],

    ]
  }

  async action([name, opts]) {
    // console.log('init', name, opts)
    //1生成项目模版
    const selectedTemplate = await createTemplate(name, opts)
    log.verbose('selectTemplate', selectedTemplate)
    if (!selectedTemplate) {
      return
    }
    //2下载项目模版至缓存目录
    await downloadTemplate(selectedTemplate)
    //3安装项目模版至项目目录
    await installTemplate(selectedTemplate, opts)
  }

  preAction() {
    // console.log('pre')
  }

  postAction() {
    // console.log('post')
  }
}

function Init(instance) {
  return new InitCommand(instance)
}

export default Init