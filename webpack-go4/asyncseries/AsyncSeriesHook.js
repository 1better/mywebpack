let {AsyncSeriesHook} = require('tapable')

  // 异步串行 先执行完一个再执行下一个 类似于express中间件 先执行完才可以再执行0
  // tapAsync  tapPromise都可以
  class lesson  {
    constructor() {
      this.hooks = {
        arch: new AsyncSeriesHook(['name'])
      }
      this.index = 0
    }
    //发布订阅的方式  这个得认真学一学
    //异步方法的第一种 tapAsync
    /* tap() {   //注册 监听函数
      this.hooks.arch.tapAsync('node',(name,cb) => {
        setTimeout(()=>{
          console.log('node',name)
          cb()
        },1000)
      })
      this.hooks.arch.tapAsync('react',(name,cb) => {
        setTimeout(()=>{
          console.log('react',name)
          cb()
        },1000)
      })
    }
    start() {
      this.hooks.arch.callAsync('hanke',function(){
        console.log("end")
      })
    } */
    tap() {   
      this.hooks.arch.tapPromise('node',name => {
        return new Promise((resolve,reject)=>{
          setTimeout(()=>{
            console.log('node',name)
            resolve()
          },1000)
        })
        
      })
      this.hooks.arch.tapPromise('react',name => {
        return new Promise((resolve,reject)=>{
          setTimeout(()=>{
            console.log('react',name)
            resolve()
          },1000)
        })
      })
    }
    start() {
      this.hooks.arch.promise('hanke').then(function(){
        console.log("end")
      })
    }
  }
  
  let l = new lesson()
  l.tap() //注册这两个事件
  l.start() //启动钩子函数