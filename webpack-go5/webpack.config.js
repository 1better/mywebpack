const path = require('path')
//模拟插件
class P{
  apply(compiler){
    //发射 订阅
    compiler.hooks.emit.tap('emit',()=>{
      console.log('emit事件')
    })
  }
}
class P1{
  apply(compiler){
    //发射 订阅
    compiler.hooks.afterPlugins.tap('emit',()=>{
      console.log('afterPlugins')
    })
  }
}
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output:{
    filename: 'bundle.js',
    path: path.resolve(__dirname,'dist')
  },
  module:{
    rules:[
      {
        test: /\.less$/,
        use:[
          path.resolve(__dirname,'loader','style-loader'),
          path.resolve(__dirname,'loader','less-loader')
        ]
      }
    ]
  },
  plugins:[
    new P(),
    new P1()
  ]
}