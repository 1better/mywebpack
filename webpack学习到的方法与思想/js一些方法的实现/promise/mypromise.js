class MyPromise {
  constructor(fn) {
    this.status = 'pending'
    this.data = ''
    this.err = ''
    if(fn){
      fn(data => this.data = data,err => this.err = err)
    }
  }
  //三种状态  pending fullfilled rejected
}
MyPromise.prototype.then = function(successCallback,failCallback){
  if(successCallback) {
    successCallback(this.data)
  }
}

let p = new MyPromise((reslove,reject)=>{
  setTimeout(()=>{
    reslove(1)
  },1000)
})

p.then( data => {
  console.log(data)
})