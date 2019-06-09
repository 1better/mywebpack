// SyncHook的实现
class SyncWaterfallHook {
  constructor(args) {
    this.tasks = []
  }
  tap(name,task) {
    this.tasks.push(task)
  }
  call(...args) {
    // this.tasks.map(task=>task(...args))
    /* let ret,index=0
    ret = this.tasks[index++](...args)
    while(index<this.tasks.length) {
      if(ret!==undefined){
        ret = this.tasks[index++](ret)
      } else {
        ret = this.tasks[index++](...args)
      }
    } */
    //解构赋值   这个没有考虑返回undefined的形式 不过这个方法我根本想不到 真的厉害
    let [first,...others] = this.tasks
    let ret = first(...args)
    others.reduce((a,b)=> b(a),ret)
  }
}
let h = new SyncWaterfallHook()
h.tap('node',(name)=>{
  console.log('node',name)
  return 'node ok'
})
h.tap('react',(data)=>{
  console.log('react',data)
  return 'react ok'
})
h.tap('webpack',(data)=>{
  console.log('webpack',data)
})
h.call('hanke')