/*
 * @Author: fenzhou
 * @Date: 2021-07-01 09:12:34
 * @LastEditors: PT
 * @LastEditTime: 2021-07-09 11:29:28
 * @Description: 适用于新版swagger文档
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

// const { baseURL: baseUrl } = require('./base.json') // 网关服务 需要手动设置
const baseUrl = '{{ baseUrl }}' // 网关服务 需要手动设置

let modelsName = '',
  basePath = ''
// 获取所有微服务 http://10.232.238.227:9001/swagger-resources
request(`${baseUrl}/swagger-resources`).then(models => {
  getModelsApi(models)
})

// 获取所有微服务中api
function getModelsApi(models) {
  if (models && models.length > 0) {
    models.forEach(ele => {
      // 调用微服务api-docs接口，获取当前微服务下的api http://10.232.238.227:9001/umps/v2/api-docs
      console.log(`开始下载 ${baseUrl}${ele.url}中的api`)
      request(`${baseUrl}${ele.url}`).then(res => {
        if (!res['paths']) {
          console.warn(`${baseUrl}${ele.url}中未找到对应API`)
          return
        }
        modelsName = res.info.title
        basePath = res.basePath
        // paths为接口列表
        recursiveDoc(res.paths)
      })
    })
  }
}

function recursiveDoc(list) {
  if (JSON.parse(JSON.stringify(list)) === '') return false
  let data = 'import axios from \'@/utils/request\'\n'
  let method = '',
    filename = `${modelsName}.js` // 生成的文件名
  for (let item in list) {
    if (list[item]['post']) {
      // post请求
      method = 'post'
      data += `export const ${generateVar(basePath + item)} = (data,config) => {return axios({url:'${basePath + item}', method: '${method}', data, config})}//${list[item][method]['summary']}\n`
      // data += `export const ${(basePath + item).replace(/\//g, '_').substring(1)} = (data,config) => {return axios({url:'${basePath + item}', method: '${method}', data, config})}//${list[item][method]['summary']}\n`
    } else if (list[item]['get']) {
      // get请求
      method = 'get'
      data += `export const ${generateVar(basePath + item)} = (data,config) => {return axios({url:'${basePath + item}', method: '${method}', config, params: data})}//${list[item][method]['summary']}\n`
    }
  }
  try {
    fs.writeFileSync(path.resolve(__dirname, `../src/api/${filename}`), data)
    console.log(`已生成${modelsName}的服务`)
  } catch (error) {
    console.error(`生成${modelsName}的服务对应api文件失败`)
    console.error(error)
  }
}

// str /umps/menu/deleteMenu
function generateVar (str) {
  let strList = str.substring(1).split('/')
  return strList.map((item, index) => {
    if (index === 0) {
      return item
    } else {
      return item.substring(0, 1).toUpperCase() + item.substring(1)
    }
  }).join('')
}

/**
 * 根据网址爬取数据
 */
function request(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      res.setEncoding('utf-8')
      var html = ''
      res.on('data', data => {
        html += data
      })
      res.on('end', () => {
        resolve(JSON.parse(html))
      })
    }).on('error', err => {
      reject(err)
    })
  })
}
