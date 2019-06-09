/* // import jquery from 'jquery'

import moment from 'moment'

//加入 ignorePlugin之后就不起作用了 
// moment.locale('zh-cn')

//自己手动引入所需要的语言包
import 'moment/locale/zh-cn'

let r = moment().endOf('day').fromNow()

console.log(r) */

/* import React from 'react'
import {render} from 'react-dom'

render(
  <h1>jsx</h1>,
  //这个默认的是那个root
  window.root
) */

/* import calc from './test'
// import 在生产环境下会自动清除没用的东西
// 相当于tree-shaking 没用代码自动删除
// import 可以 但是 require就不行
console.log(calc.sum(1,2))
// scope hosting 作用域提升  
// let a = 1
// let b = 2
// let c = 3
// let d = a+b+c //webpack会自动省略可以简化的代码
 // console.log(d+'------') */

//  import  './a'
//  import  './b'

//  console.log('index.js')

/* let button = document.createElement('button')

button.innerHTML = 'hello'

//vue react懒加载 都是这样
button.addEventListener('click',()=>{
  //es6草案中的语法 实现jsonp动态加载文件
  import ('./source.js') .then(data=>{
    console.log(data.default)
  })
})

document.body.append(button) */

import str from './source.js'

console.log(str)

if(module.hot) {
  module.hot.accept('./source.js',()=>{
    //import只能写在页面的顶端
    let str =require('./source.js')
    console.log(str.default)
  })
}

