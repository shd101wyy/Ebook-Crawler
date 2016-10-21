const request = require('request'),
  cheerio = require('cheerio'),
  async = require('async'),
  iconv = require('iconv-lite'),
  fs = require('fs'),
  path = require('path')

/**

 ebook crawler

 CHECK README.md for more information

 options: {
  bookName: '',                                // required
  url: 'http://www.piaotian.net/html/0/738/',  // required
  table: function($){ return []}               // required
  content: function($){ return ' '}            // required
  author: '',                                  // optional
  cover: '',                                   // optional
  outputDir: './',                              // optional
  charset: 'utf8',                             // optional
  addFrontMatter: false                        // optional
 }
 */
function ebookCrawler(options = {}) {
  const url = options.url,
    table = options.table,
    content = options.content,
    author = options.author,
    bookName = options.bookName,
    cover = options.cover,
    outputDir = options.outputDir || './',
    charset = options.charset || 'utf8'
    addFrontMatter = options.addFrontMatter || false

  const requestOption = {
    'encoding': null,
    'timeout': 20000,
    'headers': {
      // 'accept-charset': 'utf-8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
    }
  }

  if (!bookName) {
    throw 'bookName is not defined'
    return
  }

  if (!table) {
    throw 'table is not defined'
    return
  }

  if (!content) {
    throw 'content is not defined'
    return
  }

  request(url, requestOption, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = new Buffer(body);
      body = iconv.decode(body, charset)

      let $ = cheerio.load(body.toString('utf8'))
      let toc = table($)

      let total = toc.length,
        count = 0

      // analysisTOC(toc)
      let asyncFunc = toc.map((t) => {
        return function(cb) {
          request(t.url, requestOption, function(error, response, body) {
            count++
            process.stdout.write('                                    \r')
            process.stdout.write(`${count}/${total} finished`)
            if (!error && response.statusCode === 200) {
              body = new Buffer(body);
              body = iconv.decode(body, charset)
              let $ = cheerio.load(body.toString('utf8'))
              t.content = content($) // save to toc
              cb(null, null)
            } else {
              console.log('\nfailed to fetch ' + t.url)
              t.content = null
              cb(null, null)
            }
          })
        }
      })

      async.parallelLimit(asyncFunc, 50, function(error, results) {
        console.log('\ndone crawling the website')
          // console.log(toc)
        // output file
        if (!fs.existsSync(outputDir)){
          fs.mkdirSync(outputDir)
        }

        if (!fs.existsSync(path.resolve(outputDir, 'contents'))) {
          fs.mkdirSync(path.resolve(outputDir, 'contents'))
        }

        let summary = `# ${bookName}\n\n`
        for (let i = 0; i < toc.length; i++) {
          let level = toc[i].level || 0,
            title = toc[i].title,
            url = toc[i].url

          let j = 0
          while (j < level * 2) {
            summary += ' '
            j++
          }
          summary += `* [${title}](./contents/${title}.md)\n`
        }

        console.log(summary)
      })

    } else {
      console.log('\nfailed to fetch ' + url)
    }
  })
}

module.exports = ebookCrawler