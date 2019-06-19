class AsyncPlugin {
  
  apply(compiler){
    //这样是一个同步代码
    console.log(2)
    compiler.hooks.emit.tapAsync('AsyncPlugin',(compliation,cb)=>{
      setTimeout(()=>{
        console.log('等一下')
        cb()
      },1000)
    })
    compiler.hooks.emit.tapPromise('AsyncPlugin',(compliation)=>{
      return new Promise((resolve,reject)=>{  
        setTimeout(()=>{
          console.log('再等一下')
          resolve()
        },1000)
      })
    })
  }
}
module.exports = AsyncPlugin