/*
 * @Author: PT
 * @Date: 2021-06-30 09:38:40
 * @LastEditors: PT
 * @LastEditTime: 2021-06-30 09:41:31
 * @Description: file content
 */
/**
 * 名称校验
 * 包名长度应该大于零
 * 包名中的所有字符必须是小写，也就是说，不允许大写或大小写混合
 * 包名可以由连字符组成
 * 包名称不能包含任何非URL安全的字符(因为名称最终是URL的一部分)
 * 包名不应该以。或_
 * 包名不应该包含任何前导或尾随空格
 * 包名不能包含以下字符:~)('!＊
 * 包名不能与node.js/io.js核心模块或保留/黑名单名称相同。例如，以下名称无效:
 *   http
 *   流
 *   node_modules
 *   favicon.ico
 * 包名长度不能超过214
 * @param {string} name 校验的名称
 * 
 */
const validateNpmPackageName = require('validate-npm-package-name') // 检测名字是否合法

exports.validateName = name => {
  return validateNpmPackageName(name)
}