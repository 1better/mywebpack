let less = require('less')
let css = ''
function loader(source){
  less.render(source,(error,c)=>{
    css = c.css
  })
  //正则 将/n替换成//n 不然会被当做转义字符来处理 不换行
  css = css.replace(/\n/g,'\\n')
  return css
}
module.exports = loader