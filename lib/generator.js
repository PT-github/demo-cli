/*
 * @Author: PT
 * @Date: 2020-05-28 09:29:19
 * @LastEditors: PT
 * @LastEditTime: 2021-07-09 11:30:26
 * @Description: 模版文件解析
 */
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
// const rm = require('rimraf').sync

module.exports = (metadata = {}, src, dest = '.', reg = null) => {
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }

  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString()
          if ((reg && reg.test(fileName)) || !reg) {
            files[fileName].contents = Buffer.from(Handlebars.compile(t)(meta))
          }
        })
        done()
      }).build(err => {
        if (err) {
          return reject(err)
        }
        // rm(src)
        resolve()
      })
  })
}
