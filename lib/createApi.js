/*
 * @Author: PT
 * @Date: 2021-07-08 18:40:25
 * @LastEditors: PT
 * @LastEditTime: 2021-07-09 15:10:34
 * @Description: file content
 */
const fs = require('fs-extra')
const { error } = require('./log')
const generator = require('./generator')
const path = require('path')
const execa = require('execa')

async function create (name, options) {
  let { output = 'bin', url } = options

  // 查看目录是否存在
  const cwd = process.cwd()
  const targetDir = path.join(cwd, name, output)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }

  // 生成脚本文件
  generator({ baseUrl: options.url }, path.resolve(__dirname, '../template/api'), targetDir, /\.js$/)

}

module.exports = (...args) => {
  return create(...args).catch(err => {
    error(err)
    process.exit(1)
  })
}