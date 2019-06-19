// import $ from 'jquery'
//默认 是 立即执行函数的loader 不会暴露全局变量
//expose-loader  暴露全局的loader  内联的loader
//pre  post normal 

// 暴露出去 下边是写法规范
// import $ from 'jquery'
import $ from 'expose-loader?$!jquery'
console.log($)
console.log(window.$)
//file-loader 图片引入 返回一个新图片地址
/* import logo from './logo.jpg'
console.log(logo)
let img = new Image()
img.src = logo
document.body.appendChild(img) */

// require('@babel/polyfill')
// require("./a.js");

// console.log("ok");

// require('./index.css')
// require('./index.less')

// let fn = () => {
//   console.log(2222)
// }

// fn()

// function *gen () {
//   yield 1;
// }
// console.log(gen().next())


// console.log('aaa'.includes('a'))

// class B {
//   c = 2;
// }
/* @log
class A {
  a = 1;
}
var a = new A()
console.log(a.a)

//这个装饰  没有学过
function log(target) {
  console.log(target)
} */