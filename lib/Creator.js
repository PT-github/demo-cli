/*
 * @Author: PT
 * @Date: 2021-06-30 10:48:46
 * @LastEditors: PT
 * @LastEditTime: 2021-07-02 17:02:23
 * @Description: file content
 */
const EventEmiter = require('events')
const fs = require('fs-extra')
const { error, warn, done } = require('./log')
const ora = require('ora')
const constant = require('./constant')
const downloadGitRepo = require('download-git-repo')
const path = require('path')
const { execSync } = require('child_process')
const execa = require('execa')

module.exports = class Creator extends EventEmiter {
  constructor (name, context) {
    super()
    this.context = context
    this.name = name
  }

  async create (options) {
    // 创建目录
    fs.mkdirSync(this.name)
    // 下载地址
    let url = ''
    try {
      url = 'direct:' + constant.terminalConfigObj[options.terminal].git
    } catch (err) {
      error(`未配置终端为${constant.terminalConfigObj[options.terminal]['name']}工程镜像地址`)
      process.exit(1)
    }
    // 下载工程
    await this.download(url)
    // 根据options选项配置工程
    await this.config(options)
  }

  // 下载工程
  async download (url) {
    const spinner = ora('工程代码下载中...').start()
    await new Promise(resolve => {
      downloadGitRepo(url, this.context, { clone: true }, err => {
        if (err) {
          error(err)
          spinner.fail('下载失败')
          process.exit(1)
        }
        spinner.succeed('下载成功')
        resolve()
      })
    })
  }

  // 配置工程
  async config (options) {
    // 配置package.json
    let packagePath = path.join(this.context, 'package.json')
    let data = { name: this.name, description: options.description }
    fs.existsSync(packagePath) && this.rewriteJson(packagePath, data)

    // 配置生成axios异步脚本
    if (!options.axios) {
      fs.removeSync(path.join(this.context, 'bin'))
    } else {
      let filepath = path.join(this.context, 'bin/base.json')
      let data = { baseURL: options.baseURL }
      this.rewriteJson(filepath, data)
    }

    // 是否需要案例
    if (!options.case) {
      fs.removeSync(path.join(this.context, 'src/cases'))
    }

    // 是否需要公共组件
    if (!options.command) {
      fs.removeSync(path.join(this.context, 'src/components'))
    }

    // 是否使用git管理版本
    if (options.git) {
      await this.initGit()
    }
    done('项目创建成功')
    
  }

  // 重写json文件
  rewriteJson (filepath, data) {
    let file = fs.statSync(filepath)
    if (!file.isFile()) {
      error(`${filepath}文件不存在`)
      process.exit(1)
    }
    var jsonData = JSON.parse(fs.readFileSync(filepath)) || {}
    Object.assign(jsonData, data)
    fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2))
  }

  // git初始化
  async initGit () {
    // 检测是否存在git
    try {
      execSync('git --version', { stdio: 'ignore' })
      await this.run('git init')
    } catch (e) {
      warn('检测系统未安装git软件，无法使用git管理软件版本')
    }
  }

  // 命令执行
  run (command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, { cwd: this.context })
  }

  async doweloadDependence () {
    const spinner = ora('依赖下载中...').start()
    await this.run('npm install')
    spinner.succeed('依赖下载成功')
  }
}
