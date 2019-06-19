## webpack学习...07

## 安装

> ```shell
> # 初始安装
> cnpm i webpack webpack-cli -D
> # 安装 html-webpack-plugin 来测试文件插件
> cnpm i html-webpack-plugin -D
> # 安装 css-loader mini-css-extract-loader -D 来测试 内联
> cnpm i css-loader mini-css-extract-plugin -D
> # 安装七牛来测试上传文件
> cnpm i qiniu 
> # 安装最新版 html-webpack-plugin@next来阅读文档 测试 内联
> cnpm i html-webpack-plugin@next -D
> ```
>
> 

## webpack如何调用plugin

> node_modules下的webpack下的lib中的Compiler.js
>
> ```js
> //node_modules下的webpack下的lib中的compile.js
> // 有一些钩子
> const childCompiler = new Compiler(this.context);
> 		if (Array.isArray(plugins)) {
> 			for (const plugin of plugins) {
> 				plugin.apply(childCompiler);
> 			}
> 		}
> ```
>
>  

## DonePlugin.js

> ```js
> class DonePlugin{
>   apply(compiler) // compiler.hooks
>   {
>     //这样是一个同步代码
>     console.log(1)
>     //第一个参数无所谓，放啥都可以  tapable的时候也是
>     compiler.hooks.done.tap('DonePlugin',(states)=>{
>       console.log('编译完成哦哦哦')
>     })
>   }
> }
> //还需要导出一下
> module.exports = DonePlugin
> ```
>
>  

## AsyncPlugin.js

> ```js
> class AsyncPlugin {
>   
>   apply(compiler){
>     //这样是一个同步代码
>     console.log(2)
>     compiler.hooks.emit.tapAsync('AsyncPlugin',(compliation,cb)=>{
>       setTimeout(()=>{
>         console.log('等一下')
>         cb()
>       },1000)
>     })
>     compiler.hooks.emit.tapPromise('AsyncPlugin',(compliation)=>{
>       return new Promise((resolve,reject)=>{  
>         setTimeout(()=>{
>           console.log('再等一下')
>           resolve()
>         },1000)
>       })
>     })
>   }
> }
> module.exports = AsyncPlugin
> ```
>
>  

## InlineSourcePlugin.js

> ```js
> const HtmlWebpackPlugin = require('html-webpack-plugin');
> //把外链标签变成内联
> class InlineSourcePlugin{
>   constructor({test}){
>     this.reg = test //正则
>   }
>   processTag(tag,compilation) {
>     let newTag,url
>     if(tag.tagName==='link'&&this.reg.test(tag.attributes.href)){
>       newTag = {
>         tagName: 'style',
>         attributes: {
>           type: 'text/css'
>         }
>       }
>       url = tag.attributes.href
>     }else if(tag.tagName==='script'&&this.reg.test(tag.attributes.src)){
>       newTag = {
>         tagName: 'script',
>         attributes: {
>           type: 'application/javascript'
>         }
>       }
>       url = tag.attributes.src
>     }
>     if(url){
>       newTag.innerHTML = compilation.assets[url].source() //文件内容
>       //删除这一个资源
>       delete  compilation.assets[url]
>       return newTag
>     }
>     return tag
>   }
>   processTags(data,compilation){
>     let bodyTags = []
>     let headTags = []
>     data.headTags.forEach(headTag => {
>       headTags.push(this.processTag(headTag,compilation))
>     })
>     data.bodyTags.forEach(bodyTag => {
>       bodyTags.push(this.processTag(bodyTag,compilation))
>     })
>     return {...data,headTags,bodyTags}
>   }
>   apply(compiler){
>     //要通过 HtmlWebpackPlugin的钩子来实现这一功能 根据官网文档修改
>     compiler.hooks.compilation.tap('InlineSourcePlugin', (compilation) => {
>       HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
>         'AfterPlugin', 
>         (data, cb) => {
>           //将link变成内联  script变成内联
>           data = this.processTags(data,compilation) //compilation.assets 资源
>           cb(null, data)
>         }
>       )
>     })
>   }
> }
> 
> module.exports = InlineSourcePlugin
> ```
>
>  

## webpack.config.js

> ```js
> let path = require('path')
> /* let DonePlugin = require('./plugins/DonePlugin.js')
> let AsyncPlugin = require('./plugins/AsyncPlugin.js') */
> let HtmlWebpackPlugin = require('html-webpack-plugin')
> let FileListPlugin = require('./plugins/FileListPlugin')
> let MiniCssExtractPlugin = require('mini-css-extract-plugin')
> let InlineSourcePlugin = require('./plugins/InlineSourcePlugin')
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
>         test: /\.css$/,
>         use: [MiniCssExtractPlugin.loader,'css-loader']
>       }
>     ]
>   },
>   plugins:[
>     /* new DonePlugin(),
>     new AsyncPlugin() */
>     new HtmlWebpackPlugin({
>       template: './src/index.html'
>     }),
>    /*  new FileListPlugin({
>       filename: 'list.md'
>     }), */
>     new MiniCssExtractPlugin({
>       filename: 'main.css'
>     }),
>     new InlineSourcePlugin({
>       test: /(\.js|css)/
>     })
>   ]
> }
> ```
>
> 