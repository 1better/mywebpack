## webpack学习...02  (对应12-19)

##  (ps  path.resolve 老是写错  耽误很长很长时间！)

## 安装

> ```shell
> # 安装clean-webpack-plugin 每次打包先清除dist目录下的文件
> cnpm i clean-webpack-plugin -D
> # 安装copy-webpack-plugin  打包时可以把一些文件夹的内容拷贝到其他文件夹
> cnpm i copy-webpack-plugin -D
> # webpack 自带的插件 可以加入注释声明谁开发的  webpack.BannerPlugin()
> # 安装webpack-dev-middleware webpack开发服务的一个中间件
> cnpm i webpack-dev-middleware -D
> # webpack 自带的插件 判断开发环境   webpack.DefinePlugin()
> # 安装webpack-merge 来区分不同的环境 有webpack.base.js webpack.dev.js webpack.pro.js
> cnpm i webpack-merge -D
> ```
>
> 

## 打包多页应用

>  ```js
>  //多入口需要写成一个对象
>    //两个入口
>    mode: 'development',
>    entry: {
>      //首页
>      home: './src/index.js',
>      //other页相关
>      other: './src/other.js' 
>    },
>    //两个出口
>    output:{
>      // name代表 home或者other  .[hash] 给文件加一个hash串
>      // filename: '[name].[hash].js',
>      filename: '[name].js',
>      path: path.resolve(__dirname,'dist')
>    },
>  ```
>
>  

## dev-tool的四个选项

> ```js
>  //  增加 devtool 源码映射 可以很方便的调试源代码  
>  //  源码映射 单独生成一个 source-map文件 出错会标识出错的列和行 大和全
>   devtool:'source-map',
> 
>  //  不会单独生成一个文件 但会显示行和列
>   devtool: 'eval-source-map',
> 
>  //  不会产生单独列 但会生成一个映射文件
>   devtool: 'cheap-module-source-map', //保留 后来调试用
>  //  不会单独生成文件 集成在打包文件中 也不产生列
>   devtool: 'cheap-module-eval-source-map',
> ```
>
>  

## webpack跨域问题

> ```js
> //  server.js 
> //  1
> const express = require('express')
> let app = express()
> app.get('/api/user',(req,res)=>{
> res.json({
>  	name: 'myname222'
> 	})
> })
> app.listen(3500)
> //2
> const express = require('express')
> let app = express()
> app.get('/user',(req,res)=>{
> res.json({
>  	name: 'myname222'
> })
> })
> app.listen(3500)
> ```
>
> **对应解决方法**
>
> ```js
> devServer:{
>  //这是 服务器为 /api/user  1解决方法
>   proxy : {
>    '/api':'http://localhost:3500'
>  } 
>  // /user的用法   2解决方法
>  proxy: {
>    '/api': {
>      target: 'http://localhost:3500',
>      pathRewrite: {
>        '/api':'/'
>      }
>    }  
>  }
>  //前端只想单纯模拟方法
>  before(app){ //提供的方法 相当于钩子 
>    //写这些代码就不存在跨域问题 
>    app.get('/user',(req,res)=>{
>      res.json({
>        name: 'myname-before'
>      })
>    })
>  }
>     
> //有服务端，但是不用代理来处理 在服务器端开启webpack 端口用服务端端口
>     //server.js   后端加前端合在一起解决跨域
>     //webpack自带一个express
> let express = require('express')
> let app = express()
> let webpack = require('webpack')
> //需要使用中间件  需要安装
> let middle = require('webpack-dev-middleware')
> let config = require('./webpack.config.js')
> let compiler = webpack(config)
> app.use(middle(compiler))
> app.get('/api/user',(req,res)=>{
>       res.json({
>         name: 'myname222'
>       })
> })
> app.listen(3500)
> ```
>
>   

## watch监视

> ```js
>  //监控 实时打包   类似node里边那个实时监控的
>   watch: true,
>   //监控的选项
>   watchOptions: {
>     poll: 1000, //每秒问1000次
>     aggregateTimeout: 500 ,//防抖 （类似于函数防抖）
>     ignored: /node_modules/ //忽略哪个文件
>   }, 
> ```
>
>  

## resolve属性

> ```js
> resolve: {
>     //指定解析的模块
>     	modules: [path.resolve('node_modules')],
>     // mainFiles: [],//入口文件的名字 默认找index.js
>     //或者用 mainFields  入口的字段 先找style 再找main
>     	mainFields: ['style','main'],
>     //扩展名 可以省略 需配置 extensions  依次解析
>     	extensions: ['.js','.css','.json']
>     //别名  如 vue的vue-runtime和那个@
>     // alias: {
>     //   bootstrap: 'bootstrap/dist/css/bootstrap.css'
>     // }
>   }
> ```
>
>  

## 生产或者开发环境配置

> ```js
> //webpack.pro.js
> let {smart} = require('webpack-merge')
> let base = require('./webpack.config.js')
> module.exports = smart(base,{
>   	mode:'production'
> })
> //webpack.dev.js
> let {smart} = require('webpack-merge')
> let base = require('./webpack.config.js')
> module.exports = smart(base,{
>   	mode:'development'
> })
> ```
>
> 

## webpack.config.js

> ```js
> const path = require("path");
> const HtmlWpackPlugin = require('html-webpack-plugin')
> //内置插件  版权归谁谁谁所有 先导入webpack
> const webpack = require('webpack')
> 
> 
> //copy插件
> const copyWpackPlugin = require('copy-webpack-plugin')
> 
> // bannerPlugin 版权声明
> const bannerPlugin = new webpack.BannerPlugin('make by hanke ,i will become success!')
> // 这个是错误写法  正确写法 应该是解构赋值那样写 说明这个插件包含许多东西
> // const CleanWebpackPlugin = require('clean-webpack-plugin')
>  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
> 
>  //拷贝文件
>  const copyPlugin = new copyWpackPlugin(
>    //接受一个数组 可以多个文件
>    [{from:'./doc',to:'./'}]
>  )
> 
> // 三个其他的小插件
> // 1. cleanWebpackPlugin  // 每次打包会把dist目录下的文件都删除 重新打包
> // 2. copyWebpackPlugin
> // 3. bannerPlugin
> // 前两个 需要第三方模块 第三个内置
> 
> 
> // 判断开发环境的插件  DefinePlugin
> const definePlugin = new webpack.DefinePlugin({
>   	DEV: JSON.stringify('production')
> })
> // 也可以传入一个数组 告诉清理哪些文件夹
> const cleanPlugin = new CleanWebpackPlugin()
> 
> const htmlPlugin1 = new HtmlWpackPlugin({
>   template: './src/index.html',
>   //多个 html	
>   filename: 'home.html',
>   //代码块
>   chunks: ['home']
> })
> const htmlPlugin2 = new HtmlWpackPlugin({
>   template: './src/index.html',
>   //多个 html
>   filename: 'other.html',
>   //代码块  放置引入的东西
>   chunks: ['other']
> })
> 
> const htmlPlugin = new HtmlWpackPlugin({
>   template: './src/index.html',
>   //多个 html
>   filename: 'index.html',
> })
> module.exports = {
>   //多入口需要写成一个对象
>   //两个入口
>   mode: 'development',
>   entry: {
>     /* //首页
>     home: './src/index.js',
>     //other页相关
>     other: './src/other.js' */
> 
>     index: './src/index.js'
>   },
>   //两个出口
>   output:{
>     // name代表 home或者other  .[hash] 给文件加一个hash串
>     // filename: '[name].[hash].js',
>     filename: '[name].js',
>     path: path.resolve(__dirname,'dist')
>   },
>   /* //监控 实时打包   类似node里边那个实时监控的
>   watch: true,
>   //监控的选项
>   watchOptions: {
>     poll: 1000, //每秒问1000次
>     aggregateTimeout: 500 ,//防抖 （类似于函数防抖）
>     ignored: /node_modules/ //忽略哪个文件
>   }, */
>   //增加 devtool 源码映射 可以很方便的调试源代码  
>   //  源码映射 单独生成一个 source-map文件 出错会标识出错的列和行 大和全
>   // devtool:'source-map',
> 
>   //  不会单独生成一个文件 但会显示行和列
>   // devtool: 'eval-source-map',
> 
>   //  不会产生单独列 但会生成一个映射文件
>   //devtool: 'cheap-module-source-map', //保留 后来调试用
>   //  不会单独生成文件 集成在打包文件中 也不产生列
>   devtool: 'cheap-module-eval-source-map',
>   plugins: [
>     // 打包多页面 
>     // htmlPlugin1,
>     // htmlPlugin2
> 
>     //学习 source-map使用
>     htmlPlugin,
>     // 清除插件
>     cleanPlugin,
>     // 复制插件
>     copyPlugin,
>     // 内置插件 添加注释
>     bannerPlugin,
>     // 内置插件 判断开发环境
>     definePlugin
>   ],
>   //解析第三方模块 commen
>   resolve: {
>     //指定解析的模块
>     modules: [path.resolve('node_modules')],
>     //或者用 mainFields  入口的字段 先找style 再找main
>     // mainFiles: [],//入口文件的名字 默认找index.js
>     mainFields: ['style','main'],
>     //扩展名 可以省略 需配置 extensions  依次解析
>     extensions: ['.js','.css','.json']
>     //别名  如 vue的vue-runtime和那个@
>     // alias: {
>     //   bootstrap: 'bootstrap/dist/css/bootstrap.css'
>     // }
>   },
>   module: {
>     rules: [
>       {
>         test: /\.css$/,
>         use:['style-loader','css-loader']
>       },
>       {
>         test: /\.js$/,
>         use: {
>           loader: 'babel-loader',
>           options: {
>             presets: ['@babel/preset-env']
>           }     
>         },
>         exclude: /node_modules/
>       }
>     ]
>   },
>   //跨域问题的设置
>   devServer:{
>     //这是 服务器为 /api/user
>     /* proxy : {
>       '/api':'http://localhost:3500'
>     } */
>     // /user的用法
>     /* proxy: {
>       // 重写的方式 把请求代理到express服务器上
>       '/api': {
>         target: 'http://localhost:3500',
>         pathRewrite: {
>           '/api':'/'
>         }
>       }  
>     } */
>     //前端只想单纯模拟方法
>     /* before(app){ //提供的方法 相当于钩子 
>       //写这些代码就不存在跨域问题 
>       app.get('/user',(req,res)=>{
>         res.json({
>           name: 'myname-before'
>         })
>       })
>     } */
>     //有服务端，但是不用代理来处理 在服务器端开启webpack 端口用服务端端口
>   }
> }
> ```
>
>  

## index.js(测试用)

> ```js
> // class B {
> //   constructor() {
> //     console.log('11111')
> //   }
> // }
> // // console.log('a')
> // var b = new B()
> // import 'bootstrap'
> // import './style'
> /* let xhr = new XMLHttpRequest()
> 
> xhr.open('GET','/api/user',true)
> 
> xhr.onload = function() {
>   console.log(xhr.response)
> }
> 
> xhr.send() */
> let url = ''
> if(DEV==='dev') {
>   url = 'localhost'
> }else {
>   url = 'hanke'
> }
> console.log(url)
> ```
>
> 