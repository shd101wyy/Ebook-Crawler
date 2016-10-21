const ebookCrawler = require('./index.js')

let url = 'http://www.piaotian.net/html/0/738/'
ebookCrawler({
  url,
  bookName: '宰执天下',
  charset: 'gb2312', // resolve Chinese character issue
  author: 'cuslaa',
  cover: 'http://g.hiphotos.baidu.com/baike/w%3D268/sign=096c18fa1f30e924cfa49b3774096e66/472309f7905298227c6a3c31d7ca7bcb0b46d4e2.jpg',
  outputDir: './test',
  addFrontMatter: true,
  generateMarkdown: false,

  // $ is cheerio of the html
  table: function($) {
    let toc = []
    let as = $('.mainbody a')
    for (let i = 5; i < as.length; i++) {
      let a = $(as[i]),
        bookUrl = url + a.attr('href'),
        title = a.text().trim()
      toc.push({
        title: title,
        url: bookUrl,
        level: 0
      })
    }
    return toc
    // return toc.slice(0, 10) // for test
  },

  // $ is the cheerio of the html
  // title is title...
  content: function($, title) {
    $('title, script, div, table, span, h1').remove()
    let text = $('html').text().trim().replace('()',  '').replace(/\n    /g, '\n').replace(/\n/g, '<br>') // get content
    return text
  },
})