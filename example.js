const ebookCrawler = require('./index.js')

let url = 'http://www.piaotian.net/html/0/738/'
ebookCrawler({
  url,
  bookName: '宰执天下',
  charset: 'gb2312',
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
    // return toc
    return toc.slice(0, 10) // for test
  },
  content: function($) {
    $('title, script, div, table, span, h1').remove()
    let text = $('html').text().trim()
    return text
  }
})