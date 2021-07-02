/*
 * @Author: PT
 * @Date: 2021-06-29 15:22:32
 * @LastEditors: PT
 * @LastEditTime: 2021-07-02 17:10:39
 * @Description: file content
 */

const { error } = require('./log')
const { validateName } = require('./validate')
const path = require('path')
const fs = require('fs-extra') // fs的封装
const inquirer = require('inquirer') // 通用交互式命令行用户界面的集合
const chalk = require('chalk')
const Creator = require('./Creator')
const constant = require('./constant')
const { doesNotMatch } = require('assert')

/**
 * 
 * @param {string} name 项目名
 * @param {object}} options 选项
 */
async function create(name, options) {

  // 检测项目名称是否有效
  const result = validateName(name)
  if (!result.validForNewPackages) {
    error('项目名称不合法')
    result.errors && result.errors.forEach(msg => {
      error(msg)
    })
    result.warnings && result.warnings.forEach(msg => {
      error(msg)
    })
    process.exit(1)
  }

  // 查看项目目录是否存在
  const cwd = process.cwd()
  const targetDir = path.join(cwd, name)
  
  if (fs.existsSync(targetDir)) {
    // 目录存在 是否覆盖
    if (options.force) {
      // 覆盖
      await fs.remove(targetDir) // removeSync同步方法
    } else {
      // 询问是否覆盖
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'input',
          message: `${chalk.cyan(targetDir)}已经存在，请选择是否覆盖(Y/n)`,
          default: 'Y',
          validate: function (input) {
            var done = this.async()
            if ([ 'yes', 'y', 'n', 'no' ].indexOf((input + '').toLowerCase()) === -1) {
              done(`请确认是否覆盖${chalk.cyan(targetDir)}目录`)
              return
            }
            done(null, true)
          }
        }
      ])

      if ([ 'no', 'n' ].indexOf(action.toLowerCase()) !== -1) {
        process.exit(1)
      }
      // 删除已存在的目录
      await fs.remove(targetDir)
    }
  }

  // 输入项目描述
  const { description } = await inquirer.prompt([
    {
      name: 'description',
      type: 'input',
      message: `请输入项目描述`
    }
  ])

  options.description = description


  /* // 检测是PC、APP、H5、小程序、公众号、桌面端
  const { terminal } = await inquirer.prompt([
    {
      name: 'terminal',
      type: 'list',
      message: '请选择项目终端',
      choices: constant.terminalConfig
    }
  ])

  options.terminal = terminal

  switch (terminal) {
    case '1':
      // 检测PC端需要的附属功能
      const { ability } = await inquirer.prompt([
        {
          name: 'ability',
          type: 'checkbox',
          message: `请选择需要的功能`,
          choices: [
            { name: '异步脚本：自动生成axios请求代码', value: 'axios' },
            { name: '公共组件：常用的业务组件(src/components)', value: 'component' },
            { name: '案例代码：常用的业务代码(src/cases)', value: 'case' }
          ]
        }
      ])

      options.axios = ability.indexOf('axios') !== -1
      options.component = ability.indexOf('component') !== -1
      options.case = ability.indexOf('case') !== -1
    default:
      break
  } */

  // 后续扩展其他端
  options.terminal = '1'

  // 检测PC端需要的附属功能
  const { ability } = await inquirer.prompt([
    {
      name: 'ability',
      type: 'checkbox',
      message: `请选择需要的功能`,
      choices: [
        { name: '异步脚本：自动生成axios请求代码', value: 'axios' },
        { name: '公共组件：常用的业务组件(src/components)', value: 'component' },
        { name: '案例代码：常用的业务代码(src/cases)', value: 'case' }
      ]
    }
  ])

  options.axios = ability.indexOf('axios') !== -1
  options.component = ability.indexOf('component') !== -1
  options.case = ability.indexOf('case') !== -1

  // 配置异步脚本需要的url
  if (options.axios) {
    const { axios } = await inquirer.prompt([
      {
        name: 'axios',
        type: 'input',
        message: `请输入异步脚本请求的swagger-ui地址(eg: http://xx.xx.xx)`
      }
    ])
    options.baseURL = axios
  }
  

  const creator = new Creator(name, targetDir)
  await creator.create(options)

  // 询问是否进入到工程下进行依赖下载
  const { installDev } = await inquirer.prompt([
    {
      name: 'installDev',
      type: 'input',
      message: `是否下载工程依赖(Y/n)`,
      default: 'Y',
      validate: function (input) {
        var done = this.async()
        if ([ 'yes', 'y', 'n', 'no' ].indexOf((input + '').toLowerCase()) === -1) {
          done(`请确认是否下载工程依赖`)
          return
        }
        done(null, true)
      }
    }
  ])
  if ([ 'yes', 'y' ].indexOf(installDev.toLowerCase()) !== -1) {
    creator.doweloadDependence()
  }
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    error(err)
    process.exit(1)
  })
}