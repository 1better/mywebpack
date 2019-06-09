class AsyncParallelHook {
  constructor(args) {
    this.tasks = []
  }
  //实现tapPomise
  tapPromise(name,task) {
    this.tasks.push(task)
  }
  promise(...arg){
    //用map映射 保存到tasks数组中 再使用Promise.all方法 全部运行后才执行
    let tasks = this.tasks.map(task=>task(...arg))
    return Promise.all(tasks)
  }
  tapAsync(name,task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCallback = args.pop()
    let index = 0
    let done = ()=>{
      index++
      if(index===this.tasks.length){
        finalCallback()
      }
    }
    this.tasks.forEach( task=>{
      task(...args,done)
    })
  }
}
let h = new AsyncParallelHook ()
/* h.tapAsync('node',(name,cb)=>{
  setTimeout(()=>{
    console.log('node',name)
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

//  AsyncParallelBailHook 带保险的异步并发操作  有reject()就不向下执行了