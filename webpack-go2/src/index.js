// class B {
//   constructor() {
//     console.log('11111')
//   }
// }
// // console.log('a')
// var b = new B()

let xhr = new XMLHttpRequest()

xhr.open('GET','/user',true)

xhr.onload = function() {
  console.log(xhr.response)
}

xhr.send()