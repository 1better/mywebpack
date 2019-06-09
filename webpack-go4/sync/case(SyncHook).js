// SyncHook的实现
class SyncHook {
  constructor(args) {
    this.tasks = []
  }
  tap(name,task) {
    this.tasks.push(task)
  }
  call(...args) {
    this.tasks.map(task=>task(...args))
  }
}
let h = new SyncHook()
h.tap('node',(name)=>{
  console.log('node',name)
})
h.tap('react',(name)=>{
  console.log('react',name)
})
h.call('hanke')