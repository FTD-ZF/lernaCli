// 'use strict';
import path from 'node:path';
import fs from 'node:fs';
import fse from 'fs-extra';
import { pathExistsSync } from 'path-exists'
import chalk from 'chalk';
import ora from 'ora';
import { ESLint } from 'eslint';
import { execa } from 'execa';
import dayjs from 'dayjs'
import Command from '@ftd-zf/command'
import { log, makeList } from '@ftd-zf/utils'
import reactESLintConfig from './eslint/reactConfig.js'
import vueESLintConfig from './eslint/vueConfig.js'

const Default_Type = 0
const ESLint_TYPE = [
  {
    name: 'React',
    value: 'React',
  },
  {
    name: 'Vue',
    value: 'Vue',
  }
]

/**
 * 使用方式
 * ftdcli lint
 */
class ESLintCommand extends Command {

  get command() {
    return 'lint'
  }
  get description() {
    return 'ESLint代码自动化检查'
  }

  get options() {
    return []
  }

  async action() {
    let root = process.cwd();//当前项目根目录

    const rootSrcDir = path.resolve(`${root}/src`)
    const rootPackageJson = path.resolve(`${root}/package.json`)
    log.verbose(rootSrcDir)
    //判定是否有src文件夹和package.json文件
    if (!pathExistsSync(rootSrcDir) && !pathExistsSync(rootPackageJson)) {
      log.error(chalk.red('暂无正确的执行文件！'))
      log.error(chalk.red('请检查是否在项目根目录下执行！'))
      return
    }

    const selectESLintType = await this.selectESLintType()

    await this.eslint(selectESLintType);

  }

  async eslint(selectESLintType) {
    // 1. eslint
    // 准备工作，安装依赖
    const spinner = ora('正在安装依赖').start();
    try {
      await execa('npm', ['install', '-D', 'eslint-config-airbnb']);
      if (selectESLintType == 'Vue') {
        await execa('npm', ['install', '-D', 'eslint-plugin-vue']);
      }

    } catch (e) {
      log.error(e);
    } finally {
      spinner.stop();
    }
    log.info('正在执行eslint检查');
    // 执行工作，eslint
    const cwd = process.cwd();
    const eslint = new ESLint({
      cwd,
      overrideConfig: selectESLintType == 'React' ? reactESLintConfig : vueESLintConfig,
      errorOnUnmatchedPattern: false,
    });

    let results;
    if (selectESLintType == 'React') {
      results = await eslint.lintFiles(['./src/**/*.js', './src/**/*.jsx']);
    } else {
      results = await eslint.lintFiles(['./src/**/*.js', './src/**/*.vue']);
    }

    const formatter = await eslint.loadFormatter('compact');
    const resultText = formatter.format(results);
    log.verbose(resultText)
    const arr = resultText.split(cwd)

    const rega = 'Missing semicolon'
    const regb = 'Missing trailing comma'
    const regc = 'Unexpected empty object pattern'
    const regd = 'Block must not be padded by blank lines'
    const rege = 'Unexpected console statement'
    const regf = 'Too many blank lines at the beginning of file'
    const regg = 'Unexpected usage of singlequote'
    const regh = 'but never used'
    const regi = 'Unexpected trailing comma'
    const regj = 'Expected indentation of'
    const regk = 'Expected a line break'
    const regl = 'Newline required at end of file but not found'
    const regm = 'is not in camel case'
    const regn = 'is missing in props validation'
    const rego = 'Absolute imports should come before relative imports'
    const regp = 'More than 1 blank line not allowed'
    const regq = 'Maximum allowed is 100'
    const regr = 'Strings must use singlequote'
    const regs = 'Unexpected tab character'
    const regt = 'Missing parentheses around multilines JSX'
    const regu = `Expected exception block, space or tab after '//' in comment`
    const regv = `Trailing spaces not allowed`
    const regw = `A space is required after ','`
    const regx = `Expected blank line between class members`
    const regy = `Use object destructuring`

    let curStrContent = ''
    let curAccount = 0
    arr.map((item, index) => {
      if (item && item.indexOf(rega) == -1 && item.indexOf(regb) == -1 && item.indexOf(regc) == -1 &&
        item.indexOf(regd) == -1 && item.indexOf(rege) == -1 && item.indexOf(regf) == -1 && item.indexOf(regg) == -1
        && item.indexOf(regh) == -1 && item.indexOf(regi) == -1 && item.indexOf(regj) == -1 && item.indexOf(regk) == -1
        && item.indexOf(regl) == -1 && item.indexOf(regm) == -1 && item.indexOf(regn) == -1 && item.indexOf(rego) == -1
        && item.indexOf(regp) == -1 && item.indexOf(regq) == -1 && item.indexOf(regr) == -1 && item.indexOf(regs) == -1
        && item.indexOf(regt) == -1 && item.indexOf(regu) == -1 && item.indexOf(regv) == -1 && item.indexOf(regw) == -1
        && item.indexOf(regx) == -1 && item.indexOf(regy) == -1) {

        curStrContent = curStrContent + item
        curAccount++

      }
    })

    //生成文件
    const currentDate = dayjs(new Date()).format('YYYY_MM_DD_HH_mm_ss')
    const lintFileName = path.resolve(cwd, 'eslint_' + currentDate + '.log.txt')

    fse.writeFile(lintFileName, curStrContent, (err) => {
      if (err) {
        log.error(err)
      }
    })

    log.success('eslint检查完毕', '共计: ' + curAccount + '条数据');
  }

  selectESLintType() {
    return makeList({
      choices: ESLint_TYPE,
      message: '请选择ESlint检测框架',
      defaultValue: Default_Type,
    })
  }
  preAction() {
    // console.log('pre')
  }

  postAction() {
    // console.log('post')
  }
}

function lint(instance) {
  return new ESLintCommand(instance)
}


export default lint