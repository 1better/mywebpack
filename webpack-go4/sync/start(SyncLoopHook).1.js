let {SyncLoopHook} = require('tapable')

//同步遇到某个不返回undefined的值会多次执行
class lesson  {
  constructor() {
    this.hooks = {
      arch: new SyncLoopHook(['name'])
    }
    this.index = 0
  }
  //发布订阅的方式  这个得认真学一学
  tap() {   //注册 监听函数
    this.hooks.arch.tap('node',(name) => {
      console.log('node',name)
      //SyncBailHook可以卡住 return不是一个undefined的值就不会向下执行
      // return '不太会，等一等'
      return ++this.index === 3 ? undefined:'继续'
    })
    this.hooks.arch.tap('react',(name) => {
      console.log('react',name)
    })
  }
  start() {
    this.hooks.arch.call('hanke')
  }
}

let l = new lesson()
l.tap() //注册这两个事件
l.start() //启动钩子函数