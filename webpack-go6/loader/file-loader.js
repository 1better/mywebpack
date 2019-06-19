let loaderUtils = require('loader-utils')
function loader(source){
  //根据当前格式 来生成图片路径 
  let filename = loaderUtils.interpolateName(this,'[hash].[ext]',{content: source}) //根据当前内容来产生hash值
  this.emitFile(filename,source)  //内部方法 发射文件
  //处理 图片 需要返回一个模块
  return `module.exports = "${filename}"`
}
loader.raw = true  //返回二进制
module.exports = loader