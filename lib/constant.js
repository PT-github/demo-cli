/*
 * @Author: PT
 * @Date: 2021-06-30 11:53:15
 * @LastEditors: PT
 * @LastEditTime: 2021-06-30 16:30:26
 * @Description: file content
 */
/**
 * 终端框架 git 地址
 */
const TERMINAL_CONFIG = [
  {
    name: 'PC',
    value: '1',
    git: 'https://github.com/PT-github/testGit.git',
    description: 'PC端'
  },
  {
    name: 'APP',
    value: '2'
  },
  {
    name: 'H5',
    value: '3'
  },
  {
    name: '小程序',
    value: '4'
  },
  {
    name: '公众号',
    value: '5'
  },
  {
    name: '桌面端',
    value: '6'
  }
]

const TERMINAL_CONFIG_OBJ = TERMINAL_CONFIG.reduce((pre, current, index) => (pre[current.value] = current, pre), {})

module.exports = {
  terminalConfig: TERMINAL_CONFIG,
  terminalConfigObj: TERMINAL_CONFIG_OBJ
}