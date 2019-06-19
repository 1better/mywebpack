let less = require('less')
function loader(source) {
  let css
  less.render(source,(err,r) => {
    css = r.css
  })
  return css
}

module.exports = loader
