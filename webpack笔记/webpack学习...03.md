## webpcak学习...03

## 安装

> ```shell
> #实现安装
> cnpm i webpack webpack-cli html-webpack-plugin @babel/core babel-loader @babel/preset-env @babel/preset-react webpack-dev-server -D
> #安装jquery进行优化测试
> cnpm i jquery
> #安装moment 时间插件
> cnpm i moment
> #webpack内置插件 IgnorePlugin 优化
> #安装 react react-dom 来测试动态链接库
> cnpm i react react-dom
> #webpack内置插件 DllPlugin 产生一个manifest.json
> #webpack内置插件 DllReferencePlugin 得到一个manifest.json
> #安装 happypack来多线程打包webpack  适合项目比较大的时候使用
> cnpm i happypack -D
> #安装 @babel/plugin-syntax-dynamic-import -D 来转换es6草案语法
> cnpm i @babel/plugin-syntax-dynamic-import -D
> #webpack 自带插件 HotModuleReplacementPlugin和 NamedModulesPlugin实现热更新
> ```
>
> 

## webpack优化项

> ```js
> //1. 不去解析jquery中的依赖库 
> noParse: /jquery/,
> //2. webpack自带的IgnorePlugin 忽略掉moment中locale引入的东西
> 	const ignorePlugin = new webpack.IgnorePlugin(/\.\/locale/,/moment/)
> //3. 包含与排除
> 	exclude: /node_modules/,
> 	include: path.resolve('src')
> //4. 连接库的建立 (和后续webpack.react.js以及 DllPlugin DllReferencePlugin使用)
> //5. happypack多线程打包webpack
> //6. webpack自带优化
> // tree-shaking
>         import calc from './test'
>         console.log(calc.sum(1,2))
>     // import 在生产环境下会自动清除没用的东西
>     // 相当于tree-shaking 没用代码自动删除
>     // import 可以 但是 require就不行
> // scope hosting 作用域提升  
>          let a = 1
>          let b = 2
>          let c = 3
>          let d = a+b+c //webpack会自动省略可以简化的代码
>       console.log(d+'------')
> ```
>
>  

## 抽取公共代码

> ```js
> // webpack.config.js中的配置  抽取公共模块
> // index引入 a b   other也引入 a b
> optimization: {
>  splitChunks:{  //分割代码块
>    cacheGrops:{  //缓存组
>      common:{    //公共模块 
>        chunks: 'initial',  //入口从哪找
>        minSize: 0 , //大于0个字节
>        minChunks: 0 //引用0次
>      }
>    }
>  },
>  vendor: {  //抽离第三方模块 比如jquery
>      priority: 1, //先抽离第三方模块
>      test: /node_modules/, //引入
>      chunks: 'initial',  //
>      minSize: 0 , //
>      minChunks: 0 //
>    }
> }
> ```
>
> 

## webpack懒加载

> ```js
> //需要babel配置 (@babel/plugin-syntax-dynamic-import)
> // 生成 两个文件  用另一个时候再加载  （http访问）
> let button = document.createElement('button')
> button.innerHTML = 'hello'
> //vue react懒加载 都是这样
> button.addEventListener('click',()=>{
>   //es6草案中的语法 实现jsonp动态加载文件
>   import ('./source.js') .then(data=>{
>     console.log(data.default)
>   })
> })
> document.body.append(button)
> ```
>
> 

## webpack热更新

> ```js
> //热更新的概念  只更新页面的一部分 不全部更新
> import str from './source.js'
> console.log(str)
> if(module.hot) {
>   module.hot.accept('./source.js',()=>{
>     //import只能写在页面的顶端
>     let str = require('./source.js')
>     console.log(str.default)
>   })
> }
> ```
>
>  

## webpack.config.js

> ```js
> const path = require('path')
> const webpack = require('webpack')
> const HtmlWebpackPlugin = require('html-webpack-plugin')
> 
> // 模块 happypack 来多线程打包webpack  进程（node中线程与进程关系） 打包文件会加快（文件很小时可能会变慢）
> // const Happypack = require('happypack')
> 
> const htmlPlugin = new HtmlWebpackPlugin({
> 	template: './public/index.html',
> })
> 
> //webpack自带的IgnorePlugin 忽略掉moment中locale引入的东西
> const ignorePlugin = new webpack.IgnorePlugin(/\.\/locale/,/moment/)
> 
> //webpack自带的             动态引入链接库
> const dllReferencePlugin = new webpack.DllReferencePlugin({
> 	manifest: path.resolve(__dirname,'dist','manifest.json')
> })
> //  happyplugin配置
> // const happyPlugin = new Happypack({
> //   id:'js',
> //   use: [{
> //     loader:'babel-loader',
> //     options: {
> //       presets: [
> //       '@babel/preset-env',
> //       '@babel/preset-react',
> //       ]
> //     }
> //   }]
> // })
> 
> // 热更新所需插件
> const hotPlugin = new webpack.HotModuleReplacementPlugin()
> const namePlugin = new webpack.NamedModulesPlugin() //打印名字
> module.exports = {
> mode: "development",
> /* optimization: {
> splitChunks:{  //分割代码块
>   cacheGrops:{  //缓存组
>      common:{    //公共模块 
>        chunks: 'initial',  //入口从哪找
>        minSize: 0 , //大于0个字节
>        minChunks: 0 //引用0次
>      }
>    },
>    vendor: {  //抽离第三方模块
>      priority: 1, //先抽离第三方模块
>      test: /node_modules/, //引入
>      chunks: 'initial',  //入口从哪找
>      minSize: 0 , //大于0个字节
>      minChunks: 0 //引用0次
>    }
>  }
> }, */
> entry: {
> index:'./src/index.js',
> //测试抽取公共代码用
>  // other:'./src/other.js'
> },
> output: {
> filename: 'index.js',
> path: path.resolve(__dirname,'dist'),
> },
> //在package.json中配置 好像不起作用  不知道为啥子 不默认打开dist目录 先用这种方法吧
> devServer:{
> //热更新
> hot: true,
>  port: 3000,
>  open: true,
>  contentBase: './dist'
> },
> plugins: [
> htmlPlugin,
> //忽略插件
>  ignorePlugin,
>  //引入链接库插件
>  dllReferencePlugin,
>  //多线程打包文件 
>  // happyPlugin
>  // 热更新的两个插件
>  hotPlugin,
>  namePlugin
> ],
> module:{
> //不去解析jquery中的依赖库 
> noParse: /jquery/,
>  rules:[
>    {
>      test: /\.js$/,
>      //指定一个id  可能css也需要多线程打包
>      // use: 'Happypack/loader?id=js',
>      use: {
>        loader:'babel-loader',
>        options: {
>          presets: [
>          '@babel/preset-env',
>          '@babel/preset-react',
>          ],
>          plugins: [
>            '@babel/plugin-syntax-dynamic-import'
>          ]
>        }   
>      },
>      exclude: /node_modules/     
>    }
>  ]
> }
> 
> }
> ```
>
> 

## webpack.react.js(输出manifest.json)

> ```js
> const path = require('path')
> const webpack = require('webpack')
> 
> //webpack自带插件  变成动态链接库
> const dllPlugin = new webpack.DllPlugin({ //name==library
>       name: '_dll_[name]',
>       //manifest.json就是一个任务清单
>       path: path.resolve(__dirname,'dist','manifest.json')
> })
> 
> module.exports = {
>   mode: 'development',
>   entry: {
>     // test: './src/test.js'
>     react: ['react','react-dom']
>   },
>   output: {
>     filename: '_dll_[name].js', //产生文件名
>     path: path.resolve(__dirname,'dist'),
>     //指定 var a = '...'
>     library: '_dll_[name]',
>     //配置commonjs 会变成export["ab"] 配置umd会变成umd模式 可配置 commonjs var this 主要用var(默认就是)
>     //libraryTarget: 'var'
>   },
>   plugins: [
>     //导出 manifest.json 以及 _dll_react.js
>     dllPlugin
>   ]
> }
> ```
>
> 