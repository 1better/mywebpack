// 学习一下观察者模式  为promise的封装做一些准备
class Watcher {
  constructor() {
    //处理事件数组
    this.handles = {}
  }

  //订阅事件
  on(eventType,handle) {
    if(!this.handles.hasOwnProperty(eventType)){
      this.handles[eventType] = []
    }
    if(typeof handle != 'function') {
      throw new Error('这不是回调函数！')
    }
    this.handles[eventType].push(handle)
    return this
  }

  //发布事件
  emit(eventType,...args) {
    if(!this.handles.hasOwnProperty(eventType)){
      throw new Error(`${eventType}事件未注册！`)
    }else {
      this.handles[eventType].forEach( item => {
        item.apply(null,args)
      })
    }
    return this
  }

  //删除事件
  off(eventType,handle) {
    if(!this.handles.hasOwnProperty(eventType)) {
      throw new Error(`${eventType}事件未注册！`)
    } else if(typeof handle != 'function') {
      throw new Error('缺少回调函数')
    }else {
      this.handles[eventType].forEach( (item,index) => {
        if(item==handle) {
          this.handles[eventType].splice(index,1)
        }
      })
    }
    return this
  }
}

let pubSub = new Watcher()

function callback() {
  console.log('good good study')
}

pubSub.on('completed',callback)

pubSub.on('completed',(...args)=>{
  console.log(args.join(' '))
})

pubSub.emit('completed','day','day','up')

pubSub.off('completed',callback)

pubSub.emit('completed','学分置换','我凉了','啊哦')