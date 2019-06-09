class AsyncSeriesWaterfallHook {
  constructor(args) {
    this.tasks = []
  }
  //实现tapPomise
  tapPromise(name,task) {
    this.tasks.push(task)
  }
  promise(...arg){
    //redux源码类似（还没开始学习呢）  真的太强了  我完全想不出来  
    // 简直无敌啊
    let [first,...others] = this.tasks
    return others.reduce((promise,next)=>{
      return promise.then(data=> {
        if(data===undefined) {
          return next(...arg)
        }
        else {
          return next(data)
        }  
      })
    },first(...arg))     
  }
  tapAsync(name,task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCallback = args.pop()
    let index = 0
    let next = (err,data) => {
      let task = this.tasks[index]
      if(!task || err==='error'){
        return finalCallback()
      }else {
        if(index===0) {
          task(...args,next)
        }else {
          if(data===undefined){
            task(...args,next)
          } else {
            task(data,next)
          }
        }
      }
      index++
    }
    next()
  }
}
let h = new AsyncSeriesWaterfallHook ()
/* h.tapAsync('node',(name,cb)=>{
  setTimeout(()=>{
    console.log('node',name)
    //cb()对应着 next
    cb(null,'结果')
  },1000)
})
h.tapAsync('react',(name,cb)=>{
  setTimeout(()=>{
    console.log('react',name)
    cb()
  },1000)
})
h.callAsync('hanke',function(){
  console.log('end')
}) */
h.tapPromise('node',name=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      console.log('node',name)
      resolve()
    },1000)
  })
})
h.tapPromise('react',name=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      console.log('react',name)
      resolve()
    },1000)
  })
})
h.promise('hanke').then(()=>{
  console.log('end')
})