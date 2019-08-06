// 箭头函数没有自己的this，看包裹它的普通函数的this
// 利用babel来编译就是这样
let run = () => {console.log('run'); this.foo = 'foo'}

// babel 编译
let _this = this
var run = function() {
  console.log('run')
  _this.foo = 'foo'
}

// 箭头函数的奇妙用法
let arrow = (a) => (b) => {console.log(a+b)}

arrow(1,7,8)(3,5,9)  

// 这样拆分一下
let arrow = (a) => {return (b) => { console.log(a+b)} }

// 相当于
let arrow2 = function(a) {
  return function(b){
    console.log(a+b)
  }
}

arrow2(2)(4) // 6

// redux中有一个这样的方法
function compose(...funcs) {
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// 这个实际上就是 把参数放进去  比如一个数组(里边是中间件的方法)  [a,b,c]
//  compose(...[a,b,c])(store)  (...args)这一步对应着处理store
// 然后就是 a(b(c(store)))


// 拆分一下 reduce方法
let a = ()=>{
  return 1
}
let b = ()=> {
  return (1)
}
let arr = [a,b]
/* let sum = arr.reduce((a,b)=> a+b)
console.log(sum) // 9 */
let sum2 = arr.reduce((a,b)=>(...args)=> a(b(...args)))
let c = () => {
  return 3
}
console.log(sum2(c)) // 这样返回 1 

//再次改装一下
let a = (...arg)=>{
  return (1+Number(arg))
}
let b = (...arg)=> {
  return (1+Number(arg))
}
let arr = [a,b]
/* let sum = arr.reduce((a,b)=> a+b)
console.log(sum) // 9 */
let sum2 = arr.reduce((a,b)=>(...args)=> a(b(...args)))
let c = () => {
  return 3
}

console.log(a(b(c())))  // 4
console.log(sum2(c())) // 这样返回 5 
// 所以上边是这样运行的  a(b(c(store)))  // (...args) 这样可以把这些参数变成真数组来操作

// 比如
let sum = (...args) => args.slice(1,3)
console.log(sum(1,4,5,6)) // 这样就输出[4,5] 可以直接使用数组的方法（arguments数组是伪数组）

