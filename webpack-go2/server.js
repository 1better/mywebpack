//webpack自带一个express
let express = require('express')

let app = express()

let webpack = require('webpack')

//需要使用中间件
let middle = require('webpack-dev-middleware')

let config = require('./webpack.config.js')

let compiler = webpack(config)

app.use(middle(compiler))

app.get('/api/user',(req,res)=>{
  res.json({
    name: 'myname222'
  })
})

app.listen(3500)