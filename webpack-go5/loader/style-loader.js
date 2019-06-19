let style = ''
function loader(source){
  style = `let style = document.createElement('style')
  style.innerHTML = ${JSON.stringify(source)}
  document.head.appendChild(style)`
  return style

  //style.innerHTML = JSON.stringify(loader) 可以将index.less的代码转为一行
}

module.exports = loader