function loader(source){ //loader的参数就是源代码
  console.log(2)
  return source;
}
loader.pitch = function(){
  return 'ok'
}
module.exports = loader