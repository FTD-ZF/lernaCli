// 'use strict';
import { join, resolve, normalize, } from 'node:path';
import fse from 'fs-extra';
import chalk from 'chalk';
import OSS from 'ali-oss';
import Command from '@ftd-zf/command'
import { log } from '@ftd-zf/utils'

/**
 * 使用方式
 * ftdcli oss
 */
class UploadOSSCommand extends Command {

  get command() {
    return 'oss'
  }
  get description() {
    return '将资源上传阿里OSS'
  }

  get options() {
    return []
  }

  async action() {
    let root = process.cwd();//当前项目根目录

    if (!(await fse.pathExists(join(root, 'template.config.json')))) {
      return log.error(chalk.red('template.config.json 文件不存在！'))
    }

    const config = await fse.readJson(join(root, 'template.config.json'));
    const client = new OSS(config.upload.aliOSS);

    try {
      // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
      // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。

      const dirList = config.upload.dir

      if (!dirList || (dirList && dirList.length == 0) || !Array.isArray(dirList)) {
        return log.error(chalk.red('请配置dir参数！'))
      }

      log.info(chalk.gray('资源上传中...'));
      dirList.map((item, index) => {

        const assestDir = item.assestDir;
        const ossFileName = item.ossFileName;
        const dir = join(root, assestDir);

        fse.readdir(dir, function (err, files) {

          console.log(files);
          if (files && files.length != 0) {
            files.forEach(async (filename) => {

              const result = await client.put(ossFileName + '/' + filename, normalize(dir + '/' + filename))

              log.info(result.res.statusCode == '200' ? '上传成功' : result.res.statusMessage)

            })
          }
        })

      })

    } catch (e) {
      log.error(chalk.red(e))
    }

  }

  preAction() {
    // console.log('pre')
  }

  postAction() {
    // console.log('post')
  }
}

function UploadOSS(instance) {
  return new UploadOSSCommand(instance)
}


export default UploadOSS