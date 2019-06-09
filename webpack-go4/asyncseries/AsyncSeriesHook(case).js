class AsyncSeriesHook {
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
      return promise.then(()=> next(...arg))
    },first(...arg))     
  }
  tapAsync(name,task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCallback = args.pop()
    let index = 0
    let next = () => {
      if(index === this.tasks.length) return finalCallback()
      let task = this.tasks[index++]
      task(...args,next)
    }
    next()
  }
}
let h = new AsyncSeriesHook ()
/* h.tapAsync('node',(name,cb)=>{
  setTimeout(()=>{
    console.log('node',name)
    //cb()对应着 next
    cb()
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