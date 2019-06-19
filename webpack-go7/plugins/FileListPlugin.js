class FileListPlugin {
  constructor({ filename }) {
    this.filename = filename;
  }
  apply(compiler) {
    //文件准备好了，要进行发射
    compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, cb) => {
      // compilcation有很多的属性
      // 打包的资源都会放在compilcation的assets属性上
      // console.log(compilation.assets)
      let content = `##  文件名    资源大小\r\n`;
      let assets = compilation.assets;
      //Object.entries() 可以把对象变成一个数组
      Object.entries(assets).forEach(([filename, staObj]) => {
        content += `-  ${filename}    ${staObj.size()}\r\n`;
      });

      assets[this.filename] = {
        source() {
          return content;
        },
        size() {
          return content.length;
        }
      };
      cb()
    });
  }
}
module.exports = FileListPlugin;
