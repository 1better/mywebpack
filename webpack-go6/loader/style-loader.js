let loaderUtils = require('loader-utils')
let style = ''
function loader(source) {
  console.log(source)
  return `style = document.createElement('style')
  style.innerHTML = ${JSON.stringify(source)}
  document.head.appendChild(style)`
}
//在 style-laoder pitch上写一个返回值  就不执行后边  没有pitch source是一个css解析完成的字符串
loader.pitch = function(remainingRequest){
  //loaderUtils.stringifyRequest(this,'!!'+remainingRequest) 会把绝对路径转化为相对路径 
  // 这样做是为了 相当于引入一个inline-loader来处理css-loader返回的值  不需要再走其他的loader 需要加'!!'
  // 参照 pitch用法以及inline-loader使用方式来理解
  // 就是 把 css转化的 list数组 转化为 style-loader能看懂的 字符串 
  return `style = document.createElement('style')
  style.innerHTML = require(${loaderUtils.stringifyRequest(this,'!!'+remainingRequest)})
  document.head.appendChild(style)`
}
module.exports = loader

let a = 3,b = 4
[b, a] = [a, b]
console.log(b)