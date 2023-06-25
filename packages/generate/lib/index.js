// 'use strict';
import { join, resolve } from 'node:path';
import fse from 'fs-extra';
import chalk from 'chalk';
import { generateService } from '@umijs/openapi'
import Command from '@ftd-zf/command'
import { log } from '@ftd-zf/utils'

/**
 * 使用方式
 * ftdcli gen
 */
class GenerateCommand extends Command {

  get command() {
    return 'gen'
  }
  get description() {
    return '根据swagger文档自动化生成前端service代码'
  }

  get options() {
    return []
  }

  async action() {
    let root = process.cwd();//当前项目根目录
    // console.log(root)
    if (!(await fse.pathExists(join(root, 'template.config.json')))) {
      return log.error(chalk.red('template.config.json 文件不存在！'))
    }

    const config = await fse.readJson(join(root, 'template.config.json'));

    // console.log(config)
    log.info(chalk.gray('service文件生成中...'));

    for (let index = 0; index < config.openApi.length; index++) {

      if (!config.openApi[index].requestLibPath) {
        log.error(chalk.red('request请求方法路径不能为空！'))
        return
      }
      if (!config.openApi[index].schemaPath) {
        log.error(chalk.red('swagger-json地址不能为空！'))
        return
      }
      if (!config.openApi[index].serversPath) {
        log.error(chalk.red('生成service路径不能为空！'))
        return
      }

      if (config.openApi[index].schemaPath.indexOf('http') == '-1') {
        config.openApi[index].schemaPath = join(root, config.openApi[index].schemaPath)
      }

      await generateService(config.openApi[index])
    }

  }

  preAction() {
    // console.log('pre')
  }

  postAction() {
    // console.log('post')
  }
}

function Generate(instance) {
  return new GenerateCommand(instance)
}


export default Generate