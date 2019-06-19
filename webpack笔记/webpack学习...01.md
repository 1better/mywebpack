## webpack学习...01  (对应1-11)

##  安装

> ```shell
> #第一步的安装
> npm init -y   cnpm i webpack webpack-cli -D
> #-D  开发依赖，上线不需要
> npx webpack #这个指令直接就默认生成dist的main.js，默认是生产环境
> #支持模块化  可以用commonJS语法
> #安装 挂载到内存的插件
> cnpm i webpack-dev-server   html-webpack-plugin -D
> #安装 css-loader style-loader 解析css文件
> cnpm i css-loader style-loader -D
> #安装 less  less-loader 解析less文件（前边的css以及style都用的到 还有一个顺序问题）
> cnpm i less less-loader -D 
> #安装 node-sass sass-loader 解析sass文件
> cnpm i node-sass sass-loader -D 
> #安装 mini-css-extract-plugin 抽离css  将css变成link的形式引入
> cnpm i mini-css-extract-plugin -D
> #安装 postcss-loader autoprefixer自动为css添加私有化前缀 
> cnpm i postcss-loader autoprefixer -D
> #安装 optimize-css-assets-webpack-plugin 来自动压缩css文件
> cnpm i optimize-css-assets-webpack-plugin -D
> #安装 babel-loader @babel/core @babel/preset-env 来转换es6 语法
> cnpm i babel-loader @babel/core @babel/preset-env -D
> #安装 @babel/plugin-proposal-class-properties 来解析类语法
> cnpm i @babel/plugin-proposal-class-properties -D
> #安装 @babel/plugin-proposal-decorators 来解析 @log(decorators-legacy)这种语法 （这个没见过)
> #这里的配置出现了不少错误  还是不怎么熟练 
> cnpm i @babel/plugin-proposal-decorators -D
> #安装 @babel/plugin-transform-runtime 来处理js语法
> cnpm i @babel/plugin-transform-runtime -D
> cnpm i @babel/runtime  #什么都不加 这个上线也用得到
> #安装 @babel/polyfill 来解决高级用法的问题(如 字符串的includes用法)
> cnpm i @babel/polyfill  #没有 -D 
> #安装 eslint eslint-loader 来校验js语法
> cnpm i eslint eslint-loader -D
> #安装 jquery 来 测试暴露全局的loader
> cnpm i jquery -D
> #安装 expose-loader 来暴露全局
> cnpm i expose-loader -D
> #安装 file-loader 默认生成一张新的图片到build目录下 生成图片名字返回
> cnpm i file-loader -D
> #安装 html-with-loader 来解决 img src='' 这样的问题
> cnpm i html-withimg-loader -D
> #安装 url-loader 来处理图片 (一般不用file-loader来处理图片 )
> cnpm i url-loader -D
> ```
>
> 

## 配置 webpack.config.js

> ```js
> const path = require("path");
> // html挂载到内存的插件
> const HtmlWebpackPlugin = require("html-webpack-plugin");
> // 将css变成link引入的插件
> const MiniCssExtractPlugin = require("mini-css-extract-plugin")
> // 压缩css的插件
> const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
> const webpack = require('webpack')
> 
> const htmlPlugin = new HtmlWebpackPlugin({
>     template: './src/index.html' ,//模板
>     filename: 'index.html',
>     /* //压缩 html 
>     minify: {
>     //删除属性双引号
>     removeAttributeQuotes:true,
>     //变成一行
>     collapseWhitespace:true,
>     },
>     //有一个hash值
>     hash : true */
> })
> 
> // 抽离css变为link引入的形式
> const miniPlugin = new MiniCssExtractPlugin({
>     // 产生到css目录下
>     filename: 'css/main.css',
> })
> // 压缩css代码
> const optPlugin = new OptimizeCSSAssetsPlugin()
> 
> //webpackPlugin 为每个模块都注入$
> const webpackPlugin = new webpack.ProvidePlugin({
> 	$: 'jquery'
> })
> 
> module.exports = {
> /* //压缩css文件 这是之前的老版本 现在不行了
> optimization: { //优化项 new TerserJSPlugin({}),
> minimizer: [ new OptimizeCSSAssetsPlugin({})],
> }, */
> 
> /*  配置 html-webpack-plugin的第一种方法  一般不用  直接在package.json中配置就可以
> devServer: {
>  //开发服务器的配置
>  port: 3000,
>  progress: true,
>  contentBase: "./src",
>  //启动gzip压缩
>  compress: true
> }, */
> mode: "development", //模式
> entry: "./src/index.js", //入口
> output: {
> 	// filename: "bundle.js.[hash:8]", //配置hash  :8只显示8位
> 	filename: "bundle.js", //打包后的文件名
> 	path: path.resolve(__dirname, "dist") ,//路径必须是一个绝对路径
> 	// publicPath:  'http://www.hanke.com'//公共的路径 
> },
> plugins: [   //数组 放着所有webpack的插件
> 	htmlPlugin,
> 	miniPlugin,
> //新版本这样压缩就可以了
> 	optPlugin,
> //用webpack的插件 在每个模块中 都注入 $
> 	webpackPlugin
> ],
> 	//引入jquery会忽略掉(已经在cdn引入了)
> externals: {
> 	jquery: '$'
> },
> module: {   //模块
> rules: [  
> 	//配置 html读取img的src
> {
>     test: /\.html$/,
>     use: 'html-withimg-loader'
> },
> 	//配置 file-loader来读取图片
> {
> 	test: /\.(png|jpg|gif)$/, 
>    //做一个限制  当小于多少k 用base64来转化 base64文件可以减少http请求 但是比原文件大3分之1
>    // 否则用file-loader来产生真实的图片
>     use: {
>      loader: 'url-loader',
>      options: {
>        limit: 1,
>        //输出的路径
>        outputPath: 'img/',
>        //只在图片中有一个公共的路径，在解析img的loader中单独配置
>        publicPath: 'http:/111'
>      }
>     }
> },
> /*  {
>    // 添加loader规则 就不再需要import $ from 'expose-loader?$!jquery' 这样 直接 import 
>    // 这一步一直报错  这个方法显示未定义  不知道为什么 只好用第二个方法 导入插件了
>    // 哈哈哈 明白了  把下边的exclude去掉就可以了  因为它是在node_modules下边找的  这一步有点画蛇添足了，不能老是下意识地写exclude 还有 验证这个的时候把上边的 externals注释掉 不然出错
>    test: require.resolve('jquery'),
>    use: 'expose-loader?$',
>    // 注释掉就ok了  exclude: /node_modules/
>  }, */
>  /* //校验js的  先关闭  最后用到 修改
>  {
>    test: /\.js$/,use:[
>      {
>        loader: 'eslint-loader',
>        options: {
>          //强制 pre 之前执行  post 之后  未设置为normal 普通的loader
>          enforce: 'pre'
>        }
>      }
>    ],
>    exclude: /node_modules/
>  }, */
> 
>  //规则    css-loader 处理css文件 解析@import这种语法
>  // style-loader  把css标签插入到header中
>  // loader的特点  单一
>  // loader的用法  字符串只用一个loader  多个需要数组
>  // loader 的顺序  默认从右到左执行 从下到上执行
>  /* 
>    test:/\.css$/, use:[
>    'style-loader'
>    ,'css-loader'] }
>  */
>  // 也可以写成对象,可以多传入一个参数
> { 
> test:/\.css$/, use:[
>  {
>    loader:'style-loader',
>    options: {
>      //将style标签插入到顶部
>      insertAt: 'top'
>    }
>  },
>  'css-loader',
>    //为loader添加私有化前缀
>  'postcss-loader',
> ] 
> },
>  /* //配置less
>  { 
>    test:/\.less$/, use:[
>      {
>        loader:'style-loader',
>        options: {
>          //将style标签插入到顶部
>          insertAt: 'top'
>        }
>      },
>      'css-loader',
>      'less-loader' //less -> css
>    ] 
>  } */
> //抽离为
> { 
> test:/\.less$/, use:[
>  MiniCssExtractPlugin.loader,
>  'css-loader',
>  'postcss-loader',
>  'less-loader' //less -> css
> ] 
> },
> /* 配置babel */
> {
> test: /\.js$/,
> use: [
>  {
>    loader: 'babel-loader',
>    options: {
>      presets: [
>        '@babel/preset-env'
>      ],
>      plugins: [
>        // '@babel/plugin-proposal-class-properties'  解析class
>        // 上边边解析  @log
>        ["@babel/plugin-proposal-decorators", { "legacy": true }],
>        ['@babel/plugin-proposal-class-properties', { "loose": true}],
>        '@babel/plugin-transform-runtime'
>        
>      ]
>    }
>  }
> ],
> //包括
> include: path.resolve(__dirname,'src'),
> //排除
> exclude: /node_modules/ 
> }
> ]
> }
> };
> 
> ```
>
> 

## index.js(测试用)

> ```js
> // import $ from 'jquery'
> //默认 是 立即执行函数的loader 不会暴露全局变量
> //expose-loader  暴露全局的loader  内联的loader
> //pre  post normal 
> 
> // 暴露出去 下边是写法规范
> // import $ from 'expose-loader?$!jquery'
> // console.log($)
> //file-loader 图片引入 返回一个新图片地址
> import logo from './logo.jpg'
> console.log(logo)
> let img = new Image()
> img.src = logo
> document.body.appendChild(img)
> 
> // require('@babel/polyfill')
> // require("./a.js");
> 
> // console.log("ok");
> 
> // require('./index.css')
> require('./index.less')
> 
> // let fn = () => {
> //   console.log(2222)
> // }
> 
> // fn()
> 
> // function *gen () {
> //   yield 1;
> // }
> // console.log(gen().next())
> 
> 
> // console.log('aaa'.includes('a'))
> 
> // class B {
> //   c = 2;
> // }
> /* @log
> class A {
>   a = 1;
> }
> var a = new A()
> console.log(a.a)
> 
> //这个装饰  没有学过
> function log(target) {
>   console.log(target)
> } */
> ```
>
> 

## 配置 package.json

> ```json
> //重要内容 注意  这样是不对的   json标准中不允许有解析
>  "scripts": {
>     "build": "webpack",
>     "dev": "webpack-dev-server --open --port 3000 --hot "
>   }
> ```
>
> 

## (webpack打包出来最简易的bundle.js）

> ```js
> (function(modules) { // webpackBootstrap   webpack入口函数
> 	// The module cache   定义一个缓存
> 	var installedModules = {};
> 	// The require function    配置实现了 require方法
> 	function __webpack_require__(moduleId) {
> 		// Check if module is in cache   检查是否在缓存中
> 		if(installedModules[moduleId]) {
> 			return installedModules[moduleId].exports;
> 		}
> 		// Create a new module (and put it into the cache)
> 		var module = installedModules[moduleId] = {
> 			i: moduleId,
> 			l: false,
> 			exports: {}
> 		};
> 		// Execute the module function    call方法
> 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
> 		// Flag the module as loaded
> 		module.l = true;
> 		// Return the exports of the module   返回module.exports
> 		return module.exports;
> 	}
> return __webpack_require__(__webpack_require__.s = "./src/index.js");//入口模块
> })
> ({
> "./src/a.js":   //key->模块的路径
> /*! no static exports found */
> (function(module, exports) {  //value函数
> 	eval("console.log('我能行')\n\n//# sourceURL=webpack:///./src/a.js?");
> }),
> "./src/index.js":
> (function(module, exports, __webpack_require__) {
> //递归 先执行./src/a.js  再执行index.js下边的方法
> 	eval("__webpack_require__(/*! ./a.js */ \"./src/a.js\")\r\n\r\nconsole.log('ok')\n\n//# sourceURL=webpack:///./src/index.js?");
> })
> });
> ```
>
> 

## 为什么是webpack.config.js

> ```js
> //node_modules 下的webpack-cli 下的bin下的config中的config-yargs.js的这一句话
> 	defaultDescription: "webpack.config.js or webpackfile.js",
> ```
>
>  

## webpack.config.js改名之后运行

> ```shell
> npx webpack --config webpack.config.my.js  
> ```
> 
>或者  **package.json中配置**
> 
>```json
> "scripts": {
> "build" : "webpack --config webpack.config.my.js"
>  }
> //执行  npm run build  
> "scripts": {
> "build" : "webpack "
>  }
> //执行 npm run build -- --config webpack.config.my.js
> ```
> 
>

## 引入第三方模块

> 1. expose-loader 暴露给全局 window
> 2. ProvidePlugin  给每个都提供一个
> 3. 引入  不打包的方式 

## webpack打包图片 

> 1. js创建图片来引入
>
>    ​     图片引入时 采用 Import的方式引入的是一个新的图片
>
> 2. css引入background()
>3. <img src='...'/> 

## postcss.config.js配置（添加私有化前缀时需要配置）

> ```js
> module.exports = {
>   plugins: [require('autoprefixer')]
> }
> ```

## .eslintrc.json

> 直接在eslint官网生成 

