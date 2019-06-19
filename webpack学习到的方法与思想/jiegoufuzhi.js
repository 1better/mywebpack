// 解构赋值来实现 a b之间的值互换
let a = 3,b = 4;
[a,b] = [b,a]
console.log(a) //4


//解构赋值 解构数组 根据索引来 名字无所谓
let arr = [1,3,5,7,9]
let [one,two] = arr
console.log(one,two) // one 1 two 3
let [...last] = arr
console.log(last)  // last 1 3 5 7 9
// let [...last,last2] = arr 会报错


//解构对象 添加重复属性会重叠*
let obj = {
  name: 'zd',
  age: 18
}
let name = 'ls',age = 20
let obj2 = {...obj,name,age}
console.log(obj2) // name 'ls' age 20