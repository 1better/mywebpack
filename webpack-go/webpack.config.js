const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack')

const htmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html' ,//模板
  filename: 'index.html',
  /* //压缩 html 
  minify: {
    //删除属性双引号
    removeAttributeQuotes:true,
    //变成一行
    collapseWhitespace:true,
  },
  //有一个hash值
  hash : true */
})

const miniPlugin = new MiniCssExtractPlugin({
  // 产生到css目录下
  filename: 'css/main.css',
})
const optPlugin = new OptimizeCSSAssetsPlugin()
const webpackPlugin = new webpack.ProvidePlugin({
  $: 'jquery'
})
module.exports = {
  /* //压缩css文件 这是之前的老版本 现在不行了
  optimization: { //优化项 new TerserJSPlugin({}),
    minimizer: [ new OptimizeCSSAssetsPlugin({})],
  }, */
  /*
    第一种方法  一般不用  直接在package.json中配置就可以
  */
 /*  devServer: {
    //开发服务器的配置
    port: 3000,
    progress: true,
    contentBase: "./src",
    //启动gzip压缩
    compress: true
  }, */
  mode: "development", //模式
  entry: "./src/index.js", //入口
  output: {
    // filename: "bundle.js.[hash:8]", //配置hash  :8只显示8位
    filename: "bundle.js", //打包后的文件名
    path: path.resolve(__dirname, "dist") ,//路径必须是一个绝对路径
    // publicPath:  'http://www.hanke.com'//公共的路径 
  },
  plugins: [   //数组 放着所有webpack的插件
    htmlPlugin,
    miniPlugin,
    //新版本这样压缩就可以了
    optPlugin,
    //用webpack的插件 在每个模块中 都注入 $
    // webpackPlugin
  ],
  //引入jquery会忽略掉(已经在cdn引入了)
 /*  externals: {
    jquery: '$'
  }, */
  module: {   //模块
    rules: [  
      //配置 html读取img的src
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      //配置 file-loader来读取图片
      {
        test: /\.(png|jpg|gif)$/, 
        //做一个限制  当小于多少k 用base64来转化 base64文件可以减少http请求 但是比原文件大3分之1
        // 否则用file-loader来产生真实的图片
        use: {
          loader: 'url-loader',
          options: {
            limit: 1,
            //输出的路径
            outputPath: 'img/',
            //只在图片中有一个公共的路径
            publicPath: 'http:/111'
          }
        }
      },
      {
        // 添加loader规则 就不再需要import $ from 'expose-loader?$!jquery' 这样 直接 import 
        // 这一步一直报错  这个方法显示未定义  不知道为什么 只好用第二个方法 导入插件了
        test: require.resolve('jquery'),
        use: 'expose-loader?$',
        // exclude: /node_modules/
      },
      /* //校验js的  先关闭  最后用到 修改
      {
        test: /\.js$/,use:[
          {
            loader: 'eslint-loader',
            options: {
              //强制 pre 之前执行  post 之后  未设置为普通的loader
              enforce: 'pre'
            }
          }
        ],
        exclude: /node_modules/
      }, */
      
      //规则    css-loader 处理css文件 解析@import这种语法
      // style-loader  把css标签插入到header中
      // loader的特点  单一
      // loader的用法  字符串只用一个loader  多个需要数组
      // loader 的顺序  默认从右到左执行 从下到上执行
      /* 
        test:/\.css$/, use:[
        'style-loader'
        ,'css-loader'] }
      */
      // 也可以写成对象,可以多传入一个参数
      { 
        test:/\.css$/, use:[
          {
            loader:'style-loader',
            options: {
              //将style标签插入到顶部
              insertAt: 'top'
            }
          },
          'css-loader',
          'postcss-loader',
        ] 
      },
      /* //配置less
      { 
        test:/\.less$/, use:[
          {
            loader:'style-loader',
            options: {
              //将style标签插入到顶部
              insertAt: 'top'
            }
          },
          'css-loader',
          'less-loader' //less -> css
        ] 
      } */
      //抽离为
      { 
        test:/\.less$/, use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader' //less -> css
        ] 
      },
      /* 配置babel */
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
              plugins: [
                // '@babel/plugin-proposal-class-properties'  解析class
                // 下边解析  @log
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ['@babel/plugin-proposal-class-properties', { "loose": true}],
                '@babel/plugin-transform-runtime'
                
              ]
            }
          }
        ],
        //包括
        include: path.resolve(__dirname,'src'),
        //排除
        exclude: /node_modules/
       
      }
    ]
  }
};
