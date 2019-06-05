const express = require('express')

let app = express()

app.get('/user',(req,res)=>{
  res.json({
    name: 'myname222'
  })
})

app.listen(3500)