//Promise es5方法的封装

//为啥这样就行呢  我真是醉了 这一步又搞不懂了  唉
/* function MyPromise(fn){
  this.status = 'pending'
  this.data = ''
  this.err = ''
  let me = this
  if(fn){
    fn(function(data){
      me.data = data
    },function(err){
      me.err = err
    })
  }
}
MyPromise.prototype.then = function(){

}

let p = new MyPromise((resolve,reject)=>{
  // resolve(1)
}) */
// p.then(data=>{
//   console.log(data)
// })

// 噢噢噢噢   原来如此  之前就相当于这样 懂了！

 /*  
  var f = function(f2){
  f2(3)
}

  console.log(f)
if(f)
  f(data=>console.log(data)) 
  f(data=>console.log(data)) 这一步 即 let x = data=>console.log(data)
  f(x)  x是形参 然后执行下边是 x(3) 再调用x函数执行console.log(3) 这样就打印出了3
*/


