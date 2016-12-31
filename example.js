const ebookCrawler = require('./index.js')

let url = 'http://www.piaotian.net/html/0/757/'
ebookCrawler({
  url,
  bookName: '赘婿',
  charset: 'gb2312', // resolve Chinese character issue
  author: '愤怒的香蕉',
  cover: 'http://fdfs.xmcdn.com/group12/M03/DC/BE/wKgDW1aJ70HhURkfAAXL7-zgvgQ186.jpg',
  outputDir: './test',
  addFrontMatter: true,
  generateMarkdown: false,

  // $ is cheerio of the html
  table: function($) {
    const toc = []
    const as = $('.mainbody a')
    for (let i = 5; i < as.length; i++) {
      const a = $(as[i]),
        bookUrl = url.replace(/\.index.html$/, '') + a.attr('href'),
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
    $('title, script, div, table, span, h1, meta, link, center').remove()
    $('html').find('br').replaceWith('\n')
    const text = $('html').text().trim().replace('()',  '').replace(/\n(\s)*/g, '<br><br>') // get content
    return text
  },
})
