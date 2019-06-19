function loader(source){ //loader的参数就是源代码
  console.log('inline')
  return source;
}

module.exports = loader