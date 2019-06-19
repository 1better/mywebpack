## webpack学习...05

## 安装

> ```shell
> cnpm i webpack webpack-cli -D
> #如果 之前没有安装过 npx
> npm i npx -g
> #安装 babelon 把源码解析成AST @babel/traverse  遍历节点 @babel-types 节点替换 @babel-generator 生成
> cnpm i babylon @babel/traverse @babel/types @babel/generator
> #安装ejs来渲染模板(类似于tempalte-active)
> cnpm i ejs
> #安装less 来测试loader
> cnpm i less
> #安装tapable 来测试plugins
> cnpm i tapable
> ```
>
> 

## package.json

> ```json
> "bin":{
>     "hanke-webpack": "./bin/hanke-webpack.js"
> }
> ```
>
> bin相当于运行哪一个命令，执行哪一个文件

## npm link的流程

> ```shell
> #在hanke-webpack目录下  注意package.json中的bin配置以及后边是bin目录下的hanke-webpack.js 
> npm link 
> #在webpack-go5下
> npm link hanke-webpack 
> 
> #注意 这样npm link后可以直接使用hanke-webpack.cmd  就可以在webpack-go5下边运行了
> ```
>
> 

## hanke-webpack.js最开始配置

> ```js
> //  这一步  出错了 一个多小时  实际上就是 在自己电脑 nodejs中的global (npm link 后)添加了一个 hanke-webpack.cmd 和一个 hanke-webpack文件  然后 可以 hanke-webpack这样直接执行 
> // 因为路径写错了导致一直出错
> #! F:/nodejs/node.exe   //这里对应着自己node的下载地方
> let path = require('path')
> 
> let config = require(path.resolve('webpack.config.js'))
> 
> let Compiler = require('../lib/Compiler')
> 
> let compiler = new Compiler(config)
> 
> //入口函数
> compiler.hooks.entryOption.call()
> 
> compiler.run()
> 
> ```
>
>   

## compile.js

> ```js
> const fs = require('fs')
> const path = require('path')
> const babylon = require('babylon')
> const types = require('@babel/types')
> //es6模块  需要.defalut
> const traverse = require('@babel/traverse').default
> const generator = require('@babel/generator').default
> //babelon 把源码解析成AST
> //@babel/traverse   遍历节点
> //@babel/types   节点替换
> //@babel/generator 生成
> const {SyncHook } = require('tapable')
> const ejs = require('ejs')
> //引入ejs
> class Compiler{
>   constructor(config){
>     // entry output
>     this.config = config
>     // 保存文件路径
>     this.entryId //'./src/index.js'
>     // 保存所有模块依赖
>     this.modules = {}
>     this.entry = config.entry
>     //可能输出多个文件
>     this.assets = {}
>     //表示 工作路径
>     this.root = process.cwd()
>     //模拟webpack的声明周期
>     this.hooks = {
>       entryOption: new SyncHook(),
>       compile: new SyncHook(),
>       afterCompile: new SyncHook(),
>       afterPlugins: new SyncHook(),
>       run: new SyncHook(),
>       emit: new SyncHook(),
>       done: new SyncHook()
>     }
>     let plugins = this.config.plugins
>     //如果是数组
>     if(Array.isArray(plugins)){
>       plugins.forEach(plugin=>{
>         plugin.apply(this)
>       })
>     }
>     this.hooks.afterPlugins.call()
>     
>   }
>   // 得到文件内容
>   getSource(modulePath) {  
>     let content = fs.readFileSync(modulePath,'utf-8')
>     //处理 ./index.less
>     let rules = this.config.module.rules
>     rules.forEach(rule=>{
>       let {test,use} = rule
>       let len = use.length - 1
>       if(test.test(modulePath)){
>         (function normalLoader() {
>           //后边是一个绝对路径
>           let loader = require(use[len--])
>           content = loader(content)
>             if(len>=0){
>               normalLoader()
>             }
>         })()
>        
>       }
>     })
>     
>     return content
>   }
>   // 解析源码
>   parse(source,parentPath) { //主要靠AST解析语法树
>     let ast = babylon.parse(source)
>     let dependencies =  []//数组依赖
>     traverse(ast,{
>       // 调用表达式  a执行  require执行
>       CallExpression(p){
>         let node = p.node //对应的节点
>         if(node.callee.name === 'require') {
>           node.callee.name = '__webpack_require__'
>           let moduleName = node.arguments[0].value
>           moduleName = moduleName + (path.extname(moduleName)? '':'.js')
>           moduleName = './' + path.join(parentPath,moduleName) //'src/a.js'
>           dependencies.push(moduleName)
>           //节点替换
>           node.arguments = [types.StringLiteral(moduleName)]
>         }
>       }
>     })
>     let sourceCode = generator(ast).code
>     return {sourceCode,dependencies}
>   }
>   buildModule(modulePath,isEntry){
>     //模块内容
>     let source = this.getSource(modulePath)
>     // 模块id moduleName  = modulePath - this.root  // path.relative对应 此方法
>     // 这个方法没见到过  记一下
>     let moduleName = './' + path.relative(this.root,modulePath)
>     if(isEntry) {
>       this.entryId = moduleName // 保存入口名字
>     }
>     
>     // 解析 需要把source源码进行改造  返回一个依赖列表
>     let {sourceCode,dependencies} = this.parse(source,path.dirname(moduleName))
>     // 把相对路径和模块中的内容对应起来
>     this.modules[moduleName] = sourceCode
>     dependencies.forEach(dep=>{
>       //附模块的加载  递归加载
>       this.buildModule(dep,false)
>     })
>   }
>   emitFile() { //发射文件
>     //数据渲染
>     //看的是webpack.config.js中的output
>     let main = path.join(this.config.output.path,this.config.output.filename)
>     //读取模板
>     let templateStr = this.getSource(path.join(__dirname,'main.ejs'))
>     //渲染
>     let code = ejs.render(templateStr,{entryId:this.entryId,modules:this.modules})
>     //拿到输出到哪个目录下
>     //资源中 路径对应的代码
>     this.assets[main] = code
>     fs.writeFileSync(main,this.assets[main])
>   }
>   run(){
>     //执行  解析文件依赖
>     //执行  并且创建模块依赖关系
>     this.hooks.run.call()
>     //编译 调用
>     this.hooks.compile.call()
>     this.buildModule(path.resolve(this.root,this.entry),true)
>     // 发射一个文件 打包后的文件
>     this.hooks.afterCompile.call()
>     this.emitFile()
>     this.hooks.emit.call()
>     this.hooks.done.call()
>   }
> }
> module.exports = Compiler
> ```
>
> 

## webpack.config.js

> ```js
> const path = require('path')
> //模拟插件
> class P{
>   apply(compiler){
>     //发射 订阅
>     compiler.hooks.emit.tap('emit',()=>{
>       console.log('emit事件')
>     })
>   }
> }
> class P1{
>   apply(compiler){
>     //发射 订阅
>     compiler.hooks.afterPlugins.tap('emit',()=>{
>       console.log('afterPlugins')
>     })
>   }
> }
> module.exports = {
>   mode: 'development',
>   entry: './src/index.js',
>   output:{
>     filename: 'bundle.js',
>     path: path.resolve(__dirname,'dist')
>   },
>   module:{
>     rules:[
>       {
>         test: /\.less$/,
>         use:[
>           path.resolve(__dirname,'loader','style-loader'),
>           path.resolve(__dirname,'loader','less-loader')
>         ]
>       }
>     ]
>   },
>   plugins:[
>     new P(),
>     new P1()
>   ]
> }
> ```
>
>   

## less-loader.js

> ```js
> let less = require('less')
> let css = ''
> function loader(source){
>   less.render(source,(error,c)=>{
>     css = c.css
>   })
>   //正则 将/n替换成//n 不然会被当做转义字符来处理 不换行
>   css = css.replace(/\n/g,'\\n')
>   return css
> }
> module.exports = loader
> ```
>
>  

## style-loader.js

> ```js
> let style = ''
> function loader(source){
>   style = `let style = document.createElement('style')
>   style.innerHTML = ${JSON.stringify(source)}
>   document.head.appendChild(style)`
>   return style
> 
>   //style.innerHTML = JSON.stringify(loader) 可以将index.less的代码转为一行
> }
> 
> module.exports = loader
> ```
>
> 

## main.ejs

> ```ejs
> (function(modules) { // webpackBootstrap   webpack入口函数
> 	var installedModules = {};
> 	function __webpack_require__(moduleId) {
> 		if(installedModules[moduleId]) {
> 			return installedModules[moduleId].exports;
>     }
>     var module = installedModules[moduleId] = {
> 			i: moduleId,
> 			l: false,
> 			exports: {}
> 		};
> 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
> 		return module.exports;
> 	}
> return __webpack_require__(__webpack_require__.s = "<%-entryId%>");//入口模块
> })
> 
> ({
>   <%for(let key in modules) {%>
>     "<%-key%>":   //key->模块的路径
>     (function(module, exports,__webpack_require__) {  
>       eval(`<%-modules[key]%>`);
>     }),
>   <%}%>
> });
> ```
>
> 