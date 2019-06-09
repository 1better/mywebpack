class SyncLoopHook {
  constructor(args) {
    this.tasks = []
  }
  tap(name,task) {
    this.tasks.push(task)
  }
  call(...args) {
    // this.tasks.map(task=>task(...args))
    let ret
    this.tasks.forEach(task=>{
      do{
        ret = task(...args)
      }while(ret!=undefined)
    })
  }
}
let h = new SyncLoopHook ()
let total = 0
h.tap('node',(name)=>{
  console.log('node',name)
  return ++total === 3? undefined:'继续'
})
h.tap('react',(name)=>{
  console.log('react',name)
})
h.call('hanke')