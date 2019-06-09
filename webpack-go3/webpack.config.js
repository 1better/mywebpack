const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

// 模块 happypack 来多线程打包webpack  进程（node中线程与进程关系） 打包文件会加快（文件很小时可能会变慢）
// const Happypack = require('happypack')

const htmlPlugin = new HtmlWebpackPlugin({
  template: './public/index.html',
  
})

//webpack自带的IgnorePlugin 忽略掉moment中locale引入的东西
const ignorePlugin = new webpack.IgnorePlugin(/\.\/locale/,/moment/)

//webpack自带的             动态引入链接库
const dllReferencePlugin = new webpack.DllReferencePlugin({
  manifest: path.resolve(__dirname,'dist','manifest.json')
})
//  happyplugin配置
// const happyPlugin = new Happypack({
//   id:'js',
//   use: [{
//     loader:'babel-loader',
//     options: {
//       presets: [
//       '@babel/preset-env',
//       '@babel/preset-react',
//       ]
//     }
//   }]
// })

// 热更新所需插件
const hotPlugin = new webpack.HotModuleReplacementPlugin()
const namePlugin = new webpack.NamedModulesPlugin() //打印名字
module.exports = {
  mode: "development",
  /* optimization: {
    splitChunks:{  //分割代码块
      cacheGrops:{  //缓存组
        common:{    //公共模块 
          chunks: 'initial',  //入口从哪找
          minSize: 0 , //大于0个字节
          minChunks: 0 //引用0次
        }
      },
      vendor: {  //抽离第三方模块
        priority: 1, //先抽离第三方模块
        test: /node_modules/, //引入
        chunks: 'initial',  //入口从哪找
        minSize: 0 , //大于0个字节
        minChunks: 0 //引用0次
      }
    }
  }, */
  entry: {
    index:'./src/index.js',
    //测试抽取公共代码用
    // other:'./src/other.js'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname,'dist'),
  },
  //在package.json中配置 好像不起作用  不知道为啥子 不默认打开dist目录 先用这种方法吧
  devServer:{
    //热更新
    hot: true,
    port: 3000,
    open: true,
    contentBase: './dist'
  },
  plugins: [
    htmlPlugin,
    //忽略插件
    ignorePlugin,
    //引入链接库插件
    dllReferencePlugin,
    //多线程打包文件 
    // happyPlugin
    hotPlugin,
    namePlugin
  ],
  module:{
    //不去解析jquery中的依赖库 
    noParse: /jquery/,
    rules:[
      {
        test: /\.js$/,
        //指定一个id  可能css也需要多线程打包
        // use: 'Happypack/loader?id=js',
        use: {
          loader:'babel-loader',
          options: {
            presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import'
            ]
          }   
        },
        exclude: /node_modules/     
      }
    ]
  }

}