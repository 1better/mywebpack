let loaderUtils = require('loader-utils')
// 获取后缀名
let mime = require('mime')
function loader(source) {
  let {limit} = loaderUtils.getOptions(this)
  if(limit && limit>source.length){
    //转成base64编码
    return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  }else {
    // 返回file-loader  this和source通过call传入 防止参数变乱
    return require('./file-loader').call(this,source)
  }
}
loader.raw = true //转为二进制
module.exports = loader