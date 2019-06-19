function loader(source) {
  let reg = /url\((.+?)\)/g
  //第一次查找肯定是从零开始查找
  let pos = 0
  let arr = ['let list = []']
  while(current = reg.exec(source)) {
    let [matchUrl,g] = current
    //reg.lastIndex 对应着匹配最后一个字符的长度 matchUrl对应着url('./lala.jpg')的长度
    //相减可以得到前边的不包含 url的值
    let last = reg.lastIndex - matchUrl.length
    arr.push(`list.push(${JSON.stringify(source.slice(pos,last))})`)
    //把 g 替换成ruquire的写法
    arr.push(`list.push('url('+ require(${g}) +')')`)
    pos = reg.lastIndex
    // 添加后边的
    arr.push(`list.push(${JSON.stringify(source.slice(pos))})`)
    arr.push(`module.exports = list.join(' ')`)
   return arr.join('\r\n')
  }
  return source
}

module.exports = loader
