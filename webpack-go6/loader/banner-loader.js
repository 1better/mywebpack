let loaderUtils = require('loader-utils')
//骨架校验
let validateOptions = require('schema-utils')
//读取文件模块
let fs = require('fs')
function loader(source){
  this.cacheable && this.cacheable() //一般这样用 
  //this.cacheable(false) //缓存  自动缓存
  let options = loaderUtils.getOptions(this)
  let cb = this.async() //异步必备
  let schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string',

      },
      filename: {
        type: 'string'
      }
    }
  }
  //将骨架和参数对比   'banner-loader'出问题（如果报错）
  validateOptions(schema,options,'banner-loader')
  if(options.filename){
    this.addDependency(options.filename) //自动地 添加文件依赖   加入这一句话 开启实时监控 webpack也会监控这个文件 这个文件更新也会实时更新
    fs.readFile(options.filename,'utf-8',function(err,data){
      cb(err,`/**${data}**/${source}`)
    })
  }else {
    //同步也得 cb调用了
    cb(null,`/**${options.text}**/${source}`)
  }
  // return source 又是异步  需要创建一个cb
}

module.exports = loader