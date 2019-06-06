const path = require("path");
const HtmlWpackPlugin = require('html-webpack-plugin')
//内置插件  版权归谁谁谁所有 先导入webpack
const webpack = require('webpack')


//copy插件
const copyWpackPlugin = require('copy-webpack-plugin')

// bannerPlugin 版权声明
const bannerPlugin = new webpack.BannerPlugin('make by hanke ,i will become success!')
// 这个是错误写法  正确写法 应该是解构赋值那样写 说明这个插件包含许多东西
// const CleanWebpackPlugin = require('clean-webpack-plugin')
 const { CleanWebpackPlugin } = require('clean-webpack-plugin')

 //拷贝文件
 const copyPlugin = new copyWpackPlugin(
   //接受一个数组 可以多个文件
   [{from:'./doc',to:'./'}]
 )

// 三个其他的小插件
// 1. cleanWebpackPlugin  // 每次打包会把dist目录下的文件都删除 重新打包
// 2. copyWebpackPlugin
// 3. bannerPlugin
// 前两个 需要第三方模块 第三个内置


// 判断开发环境的插件  DefinePlugin
const definePlugin = new webpack.DefinePlugin({
  DEV: JSON.stringify('production')
})
// 也可以传入一个数组 告诉清理哪些文件夹
const cleanPlugin = new CleanWebpackPlugin()

const htmlPlugin1 = new HtmlWpackPlugin({
  template: './src/index.html',
  //多个 html
  filename: 'home.html',
  //代码块
  chunks: ['home']
})
const htmlPlugin2 = new HtmlWpackPlugin({
  template: './src/index.html',
  //多个 html
  filename: 'other.html',
  //代码块  放置引入的东西
  chunks: ['other']
})

const htmlPlugin = new HtmlWpackPlugin({
  template: './src/index.html',
  //多个 html
  filename: 'index.html',
})
module.exports = {
  //多入口需要写成一个对象
  //两个入口
  mode: 'development',
  entry: {
    /* //首页
    home: './src/index.js',
    //other页相关
    other: './src/other.js' */

    index: './src/index.js'
  },
  //两个出口
  output:{
    // name代表 home或者other  .[hash] 给文件加一个hash串
    // filename: '[name].[hash].js',
    filename: '[name].js',
    path: path.resolve(__dirname,'dist')
  },
  /* //监控 实时打包   类似node里边那个实时监控的
  watch: true,
  //监控的选项
  watchOptions: {
    poll: 1000, //每秒问1000次
    aggregateTimeout: 500 ,//防抖 （类似于函数防抖）
    ignored: /node_modules/ //忽略哪个文件
  }, */
  //增加 devtool 源码映射 可以很方便的调试源代码  
  //  源码映射 单独生成一个 source-map文件 出错会标识出错的列和行 大和全
  // devtool:'source-map',

  //  不会单独生成一个文件 但会显示行和列
  // devtool: 'eval-source-map',

  //  不会产生单独列 但会生成一个映射文件
  //devtool: 'cheap-module-source-map', //保留 后来调试用
  //  不会单独生成文件 集成在打包文件中 也不产生列
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    // 打包多页面 
    // htmlPlugin1,
    // htmlPlugin2

    //学习 source-map使用
    htmlPlugin,
    // 清除插件
    cleanPlugin,
    // 复制插件
    copyPlugin,
    // 内置插件 添加注释
    bannerPlugin,
    // 内置插件 判断开发环境
    definePlugin
  ],
  //解析第三方模块 commen
  resolve: {
    //指定解析的模块
    modules: [path.resolve('node_modules')],
    //或者用 mainFields  入口的字段 先找style 再找main
    // mainFiles: [],//入口文件的名字 默认找index.js
    mainFields: ['style','main'],
    //扩展名 可以省略 需配置 extensions  依次解析
    extensions: ['.js','.css','.json']
    //别名  如 vue的vue-runtime和那个@
    // alias: {
    //   bootstrap: 'bootstrap/dist/css/bootstrap.css'
    // }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use:['style-loader','css-loader']
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }     
        },
        exclude: /node_modules/
      }
    ]
  },
  //跨域问题的设置
  devServer:{
    //这是 服务器为 /api/user
    /* proxy : {
      '/api':'http://localhost:3500'
    } */
    // /user的用法
    /* proxy: {
      // 重写的方式 把请求代理到express服务器上
      '/api': {
        target: 'http://localhost:3500',
        pathRewrite: {
          '/api':'/'
        }
      }  
    } */
    //前端只想单纯模拟方法
    /* before(app){ //提供的方法 相当于钩子 
      //写这些代码就不存在跨域问题 
      app.get('/user',(req,res)=>{
        res.json({
          name: 'myname-before'
        })
      })
    } */
    //有服务端，但是不用代理来处理 在服务器端开启webpack 端口用服务端端口
  }
}