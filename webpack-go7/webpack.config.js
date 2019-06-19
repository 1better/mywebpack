let path = require('path')
/* let DonePlugin = require('./plugins/DonePlugin.js')
let AsyncPlugin = require('./plugins/AsyncPlugin.js') */
let HtmlWebpackPlugin = require('html-webpack-plugin')
let FileListPlugin = require('./plugins/FileListPlugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let InlineSourcePlugin = require('./plugins/InlineSourcePlugin')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output:{
    filename: 'bundle.js',
    path: path.resolve(__dirname,'dist')
  },
  module:{
    rules:[
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,'css-loader']
      }
    ]
  },
  plugins:[
    /* new DonePlugin(),
    new AsyncPlugin() */
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
   /*  new FileListPlugin({
      filename: 'list.md'
    }), */
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new InlineSourcePlugin({
      test: /(\.js|css)/
    })
  ]
}