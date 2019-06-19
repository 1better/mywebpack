## webpack学习...06

## 安装

> ```shell
> #提前安装
> cnpm i webpack webpack-cli -D
> #安装 @babel/core @babel/preset-env来测试 babel-loader
> cnpm i @babel/core @babel/preset-env
> #安装 loader-utils 来
> cnpm i loader-utils
> #安装 schema-utils 骨架校验
> 安装 mime 来解析文件后缀名
> #安装 less 来解析less语法
> ```
>
> 

## loader配置的三种方式

> ```js
> use:[//找loader1的第一种方式
>      // path.resolve(__dirname,'loader','loader1.js')
>        'loader1']
> resolveLoader:{
>     //第三种方法 配置modules  默认去node_modules下找 找不到去loader文件夹下找
>     modules:['node_modules',path.resolve(__dirname,'loader')]
>     /* // //第二种方法  配置 loader别名   
>     alias:{
>       'loader1':path.resolve(__dirname,'loader','loader1.js')
>     } */
> 
>   }
> ```
>
>  

## loader顺序以及分类

> ```js
> // loader默认从下到上，从右到左执行
> // loader的分类  pre 之前 post 之后  normal 正常（默认）
> // loader的标准顺序  pre normal inline(行内) post
> 
> // loader 由两部分组成  pitch-loader normal-loader
> 
> {
>         test: /\.js$/,
>         use:  'loader1',
>         enforce: 'pre'
> }
> {
>         test: /\.js$/,
>         use:  'loader2',
>         enforce: 
> }
> {
>         test: /\.js$/,
>         use:  'loader3',
>         enforce: 'post'
> }
> 
> //inline-loader处理
> //inline-loader! 这样会运行inline-loader
> // -!不会通过 pre normal来处理了
> // !没有normal
> // !!什么都不要  只用inline-loader  （这样会运行完post（之前的先走完） 再运行inline）
> require('inline-loader!./a.js')
> ```
>
>  

## loader的组成

> ```js
>      //pitch 无返回值  
> pitch   loader3 → loader2 → loader1  
>                                     ↘ 
>                                       资源
>                                     ↙
> normal   loader3 ← loader2 ← loader1 
> 	//有返回值
> user: [loader3, loader2, loader1]
>     // pitch loader - 有返回值 
> pitch   loader3 → loader2  loader1  
>                      ↙               
>                有返回值               资源
>                ↙                      
> normal  loader3  loader2  loader1
> 
> //loader2.js
> function loader(source){ //loader的参数就是源代码
>   console.log(2)
>   return source;
> }
> loader.pitch = function(){
>   return 'ok'
> }
> module.exports = loader
> 
> //这样运行 只会返回3
> ```
>
>  

## babel-loader.js

> ```js
> let babel = require("@babel/core");
> //loaderUtils 拿到预设  便于后期转化代码
> let loaderUtils = require("loader-utils");
> function loader(source) { // this loaderContext
>   //Object.keys方法  属性转成一个数组
>   let options = loaderUtils.getOptions(this);
>   // console.log(this.resourcePath)  运行时返回一个绝对路径
>   //console.log(options);
>   // options 打印为{ presets: [ '@babel/preset-env' ] }
>   let cb = this.async() // loader上下文 默认有async这个方法 异步执行 在哪执行调用cb就可以
>   //babel的transform有三个参数  第一个 转换哪些代码  第二个 转换选项  第三个 异步回调函数
>   babel.transform(source,{
>     ...options, //对象展开
>     sourceMap: true, //调试工具 需要webpack.config.js 也要配置 source-map
>     filename:  this.resourcePath.split('/').pop()//文件名  不然运行时 webpack下边是unkown
> 
>   },function(err,result){
>     //异步回调  return source就不起作用了
>     cb(err,result.code,result.map)  // 异步 cb(123) 会错误 必须严格按照参数来 
>     // 第一个 错误  第二个  代码  第三个 sourceMap
>   })
>   // return source; 不起作用
> }
> module.exports = loader;
> ```
>
>  

## banner-loader.js

> ```js
> let loaderUtils = require('loader-utils')
> //骨架校验
> let validateOptions = require('schema-utils')
> //读取文件模块
> let fs = require('fs')
> function loader(source){
>   this.cacheable && this.cacheable() //一般这样用 
>   //this.cacheable(false) //缓存  自动缓存
>   let options = loaderUtils.getOptions(this)
>   let cb = this.async() //异步必备
>   let schema = {
>     type: 'object',
>     properties: {
>       text: {
>         type: 'string',
> 
>       },
>       filename: {
>         type: 'string'
>       }
>     }
>   }
>   //将骨架和参数对比   'banner-loader'出问题（如果报错）
>   validateOptions(schema,options,'banner-loader')
>   if(options.filename){
>     this.addDependency(options.filename) //自动地 添加文件依赖   加入这一句话 开启实时监控 webpack也会监控这个文件 这个文件更新也会实时更新
>     fs.readFile(options.filename,'utf-8',function(err,data){
>       cb(err,`/**${data}**/${source}`)
>     })
>   }else {
>     //同步也得 cb调用了
>     cb(null,`/**${options.text}**/${source}`)
>   }
>   // return source 又是异步  需要创建一个cb
> }
> module.exports = loader
> ```
>
>  

## less-loader.js

> ```js
> let less = require('less')
> console.log(less)
> function loader(source) {
>   let css
>   less.render(source,(err,r) => {
>     css = r.css
>   })
>   return css
> }
> 
> module.exports = loader
> ```
>
>  

## style-loader.js

> ```js
> let style = ''
> function loader(source) {
>   return `style = document.createElement('style')
>   style.innerHTML = ${JSON.stringify(source)}
>   document.head.appendChild(style)`
> }
> module.exports = loader
> ```
>
>  

## css-loader.js

> ```js
> function loader(source) {
>   let reg = /url\((.+?)\)/g
>   //第一次查找肯定是从零开始查找
>   let pos = 0
>   let arr = ['let list = []']
>   while(current = reg.exec(source)) {
>     let [matchUrl,g] = current
>     //reg.lastIndex 对应着匹配最后一个字符的长度 matchUrl对应着url('./lala.jpg')的长度
>     //相减可以得到前边的不包含 url的值
>     let last = reg.lastIndex - matchUrl.length
>     arr.push(`list.push(${JSON.stringify(source.slice(pos,last))})`)
>     //把 g 替换成ruquire的写法
>     arr.push(`list.push('url('+ require(${g}) +')')`)
>     pos = reg.lastIndex
>     // 添加后边的
>     arr.push(`list.push(${JSON.stringify(source.slice(pos))})`)
>     arr.push(`module.exports = list.join(' ')`)
>    return arr.join('\r\n')
>   }
>   return source
> }
> module.exports = loader
> ```
>
>  

## webpack.config.js

> ```js
> let path = require("path");
> module.exports = {
>   mode: "development",
>   entry: "./src/index.js",
>   output: {
>     filename: "build.js",
>     path: path.resolve(__dirname, "dist")
>   },
> 
>   resolveLoader: {
>     //第三种方法 配置modules  默认去node_modules下找 找不到去loader文件夹下找
>     modules: ["node_modules", path.resolve(__dirname, "loader")]
>     /* // //第二种方法  配置 loader别名配置别名
>     alias:{
>       'loader1':path.resolve(__dirname,'loader','loader1.js')
>     } */
>   },
>   devtool:'source-map',
>   // watch:true,
>   module: {
>     rules:[
>       {
>         test: /\.less$/,
>         use:[
>           'style-loader',
>           'css-loader',
>           'less-loader'  
>         ]
>       },
>       {
>         test: /\.jpg$/,
>         // 目的 根据图片生成一个 md5串 发射到dist目录下 file-loader还会返回当前路径
>      /*    use:{
>           loader: 'file-loader',
>         } */
>         use:{  //符号中文  会报Invalid or unexpected token
>           loader: 'url-loader', //url-loader会处理路径并且交给file-loader
>           options:{
>             limit: 200*1024
>           }
>         }
>       }
>       /* {
>         test: /\.js$/,
>         use:{
>           loader: 'banner-loader',
>           options:{
>             text: 'hanke',
>             //如果没有给text的时候
>             filename: path.resolve(__dirname,'banner.js')
>           }
>         }
>       } */
>       /* {
>         test: /\.js$/,
>         use:{
>           loader: 'babel-loader',
>           options:{
>             presets: [
>               '@babel/preset-env'
>             ]
>           }
>         }
>       } */
>     ]
>   //   rules: [
>   //     /* {
>   //       test: /\.js$/,
>   //       use:[
>   //         //找loader1的几种方式
>   //         // path.resolve(__dirname,'loader','loader1.js')
>   //         'loader3','loader2','loader1'
>   //         //从右到左 从下到上执行
>   //       ]
>   //     } */
>   //     {
>   //       test: /\.js$/,
>   //       use: "loader1",
>   //       enforce: "pre"
>   //     },
>   //     {
>   //       test: /\.js$/,
>   //       use: "loader2"
>   //     },
>   //     {
>   //       test: /\.js$/,
>   //       use: "loader3",
>   //       enforce: "post"
>   //     }
>   //   ]
>   }
> };
> 
> ```
>
> 

