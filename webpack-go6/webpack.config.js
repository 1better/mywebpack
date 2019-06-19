let path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "dist")
  },

  resolveLoader: {
    //第三种方法 配置modules  默认去node_modules下找 找不到去loader文件夹下找
    modules: ["node_modules", path.resolve(__dirname, "loader")]
    /* // //第二种方法  配置 loader别名配置别名
    alias:{
      'loader1':path.resolve(__dirname,'loader','loader1.js')
    } */
  },
  devtool:'source-map',
  // watch:true,
  module: {
    rules:[
      {
        test: /\.less$/,
        use:[
          'style-loader',
          'css-loader',
          'less-loader'  
        ]
      },
      {
        test: /\.jpg$/,
        // 目的 根据图片生成一个 md5串 发射到dist目录下 file-loader还会返回当前路径
     /*    use:{
          loader: 'file-loader',
        } */
        use:{  //符号中文  会报Invalid or unexpected token
          loader: 'url-loader', //url-loader会处理路径并且交给file-loader
          options:{
            limit: 200*1024
          }
        }
      }
      /* {
        test: /\.js$/,
        use:{
          loader: 'banner-loader',
          options:{
            text: 'hanke',
            //如果没有给text的时候
            filename: path.resolve(__dirname,'banner.js')
          }
        }
      } */
      /* {
        test: /\.js$/,
        use:{
          loader: 'babel-loader',
          options:{
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      } */
    ]
  //   rules: [
  //     /* {
  //       test: /\.js$/,
  //       use:[
  //         //找loader1的几种方式
  //         // path.resolve(__dirname,'loader','loader1.js')
  //         'loader3','loader2','loader1'
  //         //从右到左 从下到上执行
  //       ]
  //     } */
  //     {
  //       test: /\.js$/,
  //       use: "loader1",
  //       enforce: "pre"
  //     },
  //     {
  //       test: /\.js$/,
  //       use: "loader2"
  //     },
  //     {
  //       test: /\.js$/,
  //       use: "loader3",
  //       enforce: "post"
  //     }
  //   ]
  }
};
