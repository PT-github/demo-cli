/*
 * @Author: PT
 * @Date: 2021-07-09 15:39:23
 * @LastEditors: PT
 * @LastEditTime: 2021-07-09 15:51:12
 * @Description: file content
 */

function assign (target, source) {
  for (var key in source) {
    if (typeof source[key] === 'object') {
      !target[key] && (target[key] = Array.isArray(source[key]) ? [] : {})
      assign(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

exports.assign = assign