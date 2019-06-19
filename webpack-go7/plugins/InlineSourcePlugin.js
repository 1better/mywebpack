const HtmlWebpackPlugin = require('html-webpack-plugin');
//把外链标签变成内联
class InlineSourcePlugin{
  constructor({test}){
    this.reg = test //正则
  }
  processTag(tag,compilation) {
    let newTag,url
    if(tag.tagName==='link'&&this.reg.test(tag.attributes.href)){
      newTag = {
        tagName: 'style',
        attributes: {
          type: 'text/css'
        }
      }
      url = tag.attributes.href
    }else if(tag.tagName==='script'&&this.reg.test(tag.attributes.src)){
      newTag = {
        tagName: 'script',
        attributes: {
          type: 'application/javascript'
        }
      }
      url = tag.attributes.src
    }
    if(url){
      newTag.innerHTML = compilation.assets[url].source() //文件内容
      //删除这一个资源
      delete  compilation.assets[url]
      return newTag
    }
    return tag
  }
  processTags(data,compilation){
    let bodyTags = []
    let headTags = []
    data.headTags.forEach(headTag => {
      headTags.push(this.processTag(headTag,compilation))
    })
    data.bodyTags.forEach(bodyTag => {
      bodyTags.push(this.processTag(bodyTag,compilation))
    })
    return {...data,headTags,bodyTags}
  }
  apply(compiler){
    //要通过 HtmlWebpackPlugin的钩子来实现这一功能 根据官网文档修改
    compiler.hooks.compilation.tap('InlineSourcePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'AfterPlugin', 
        (data, cb) => {
          //将link变成内联  script变成内联
          data = this.processTags(data,compilation) //compilation.assets 资源
          cb(null, data)
        }
      )
    })
  }
}

module.exports = InlineSourcePlugin