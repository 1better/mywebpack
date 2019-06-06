// class B {
//   constructor() {
//     console.log('11111')
//   }
// }
// // console.log('a')
// var b = new B()
// import 'bootstrap'
// import './style'
/* let xhr = new XMLHttpRequest()

xhr.open('GET','/api/user',true)

xhr.onload = function() {
  console.log(xhr.response)
}

xhr.send() */
let url = ''
if(DEV==='dev') {
  url = 'localhost'
}else {
  url = 'hanke'
}

console.log(url)