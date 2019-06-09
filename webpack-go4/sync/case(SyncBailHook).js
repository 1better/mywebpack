// SyncHook的实现
class SyncBailHook {
  constructor(args) {
    this.tasks = []
  }
  tap(name,task) {
    this.tasks.push(task)
  }
  call(...args) {
    // this.tasks.map(task=>task(...args))
    let ret,index=0
    do{
      ret = this.tasks[index++](...args)
    }while(ret === undefined && index < this.tasks.length)
  }
}
let h = new SyncBailHook()
h.tap('node',(name)=>{
  console.log('node',name)
  return '停一停吧'
})
h.tap('react',(name)=>{
  console.log('react',name)
})
h.call('hanke')