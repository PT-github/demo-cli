/*
 * @Author: PT
 * @Date: 2021-06-29 15:26:06
 * @LastEditors: PT
 * @LastEditTime: 2021-07-02 15:56:41
 * @Description: file content
 */
const chalk = require('chalk') // 终端字符串样式设置
const stripAnsi = require('strip-ansi') // 字符串中、ANSI转义（版本为6）

const format = (label, msg) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label}${line}`
      : line.padStart(stripAnsi(label).length)
  }).join('\n')
}

const chalkTag = msg => chalk.bgWhiteBright.white.dim(` ${msg} `)

/**
 * 错误日志
 * @param {string} msg 提示内容
 * @param {string}} tag 标记
 */
exports.error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

/**
 * 警告日志
 * @param {string} msg 提示内容
 * @param {string}} tag 标记
 */
 exports.warn = (msg, tag = null) => {
  console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)))
}

/**
 * 日志
 * @param {string} msg 提示内容
 * @param {string}} tag 标记
 */
 exports.info = (msg, tag = null) => {
  console.info(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg))
}

/**
 * 完成日志
 * @param {string} msg 提示内容
 * @param {string}} tag 标记
 */
 exports.done = (msg, tag = null) => {
  console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg))
}
