#! F:/nodejs/node.exe  
// 表示在node环境下运行

let path = require('path')

let config = require(path.resolve('webpack.config.js'))

let Compiler = require('../lib/Compiler')

let compiler = new Compiler(config)

//入口函数
compiler.hooks.entryOption.call()

compiler.run()
