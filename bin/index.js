#!/usr/bin/env node

const { program } = require('commander')

program.version(require('../package.json').version, '-v, --versions', '当前版本号')

program
  .command('create <project-name>')
  .description('创建项目')
  .option('-g, --git', '是否使用git管理版本', true)
  .option('--no-g, --no-git', '禁止使用git管理版本')
  .option('-f, --force', '强制覆盖目录')
  .action((name, options) => {
    require('../lib/create')(name, options)
  })

program
  .command('api')
  .description('添加axios自动生成脚本文件')
  .option('-o, --output <output>', '脚本输出目录', 'bin')
  .option('-u, --url <url>', 'swagger-ui地址', 'http://xxx.xxx.xxx')
  .action((options) => {
    // console.log(options, '===')
    require('../lib/createApi')( '.', options)
  })

// 解析参数
program.parse(process.argv)
