class DonePlugin{
  apply(compiler) // compiler.hooks
  {
    //这样是一个同步代码
    console.log(1)
    //第一个参数无所谓，放啥都可以  tapable的时候也是
    compiler.hooks.done.tap('DonePlugin',(states)=>{
      console.log('编译完成哦哦哦')
    })
  }
}
//还需要导出一下
module.exports = DonePlugin