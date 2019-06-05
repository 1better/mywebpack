## webpack学习...02   (ps  resolve 老是写错  耽误很长很长时间！)

## 安装

> ```shell
> # 安装clean-webpack-plugin 每次打包先清除dist目录下的文件
> cnpm i clean-webpack-plugin -D
> # 安装copy-webpack-plugin  打包时可以把一些文件夹的内容拷贝到其他文件夹
> cnpm i copy-webpack-plugin -D
> # 安装webpack-dev-middleware webpack开发服务的一个中间件
> cnpm i webpack-dev-middleware -D
> ```
>
> 

## 打包多页应用

>  

## dev-tool的四个选项

> ```js
>  //增加 devtool 源码映射 可以很方便的调试源代码  
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
> //server.js 
> //1
> const express = require('express')
> let app = express()
> app.get('/api/user',(req,res)=>{
>   res.json({
>     name: 'myname222'
>   })
> })
> app.listen(3500)
> //2
> const express = require('express')
> let app = express()
> app.get('/user',(req,res)=>{
>   res.json({
>     name: 'myname222'
>   })
> })
> app.listen(3500)
> ```
>
> **对应解决方法**
>
> ```js
> devServer:{
>     //这是 服务器为 /api/user  1解决方法
>      proxy : {
>       '/api':'http://localhost:3500'
>     } 
>     // /user的用法   2解决方法
>     proxy: {
>       '/api': {
>         target: 'http://localhost:3500',
>         pathRewrite: {
>           '/api':'/'
>         }
>       }  
>     }
>     //前端只想单纯模拟方法
>     before(app){ //提供的方法 相当于钩子 
>       //写这些代码就不存在跨域问题 
>       app.get('/user',(req,res)=>{
>         res.json({
>           name: 'myname-before'
>         })
>       })
>     }
> ```
>
> 

