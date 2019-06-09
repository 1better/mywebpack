const path = require('path')
const webpack = require('webpack')

//webpack自带插件  变成动态链接库
const dllPlugin = new webpack.DllPlugin({ //name==library
  name: '_dll_[name]',
  //manifest.json就是一个任务清单
  path: path.resolve(__dirname,'dist','manifest.json')
})

module.exports = {
  mode: 'development',
  entry: {
    // test: './src/test.js'
    react: ['react','react-dom']
  },
  output: {
    filename: '_dll_[name].js', //产生文件名
    path: path.resolve(__dirname,'dist'),
    //指定 var a = '...'
    library: '_dll_[name]',
    //配置commonjs 会变成export["ab"] 配置umd会变成umd模式 可配置 commonjs var this 主要用var(默认就是)
    //libraryTarget: 'var'
  },
  plugins: [
    //导出 manifest.json 以及 _dll_react.js
    dllPlugin
  ]
}