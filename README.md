# Ebook Crawler  
A simple ebook crawler for study purpose...  
Output `.ePub` file.   
Output `markdown` files if needed.      

## How to use?  
* clone or download this project.  
* cd to project folder  
* `npm install`  
* modify `example.js`  
* `node example.js`  

## API  
`ebookCrawler`  
you should pass an `options` object to `ebookCrawler` function.   
the `options` object has the following specifications:  

| name  | required | type | example |
|---|---|---|---|
| bookName | required | string | 宰执天下 |
| url | required | string or array | http://www.piaotian.net/html/0/738/ |
| `table` | required | function | check `example.js` |  
| `content` | required | function | check `example.js` |  
| author | optional | string | 'cuslaa' |  
| cover | optional | string | 'http://...' |
| outputDir | optional | string | './' |  
| charset | optional | string | 'utf8', 'gb2312'|
| addFrontMatter | optional | boolean | false |   
| generateMarkdown | optional | boolean | false |

`table` function will parse toc for ebook.   
it should return an `array` in this format.   
```
[
  {
    "title": "title of chapter or section",
    "level": "chapter level. default 0",
    "url": "url to that chapter"
  },
  {
    ...
  }
]
```

`content` function will parse the content got from `url` of `toc`.     

check `example.js` for the example of `table` and `content` function.  

## Generate other ebook type files    
The output `bookName.md` file can be converted to `.ePub`, `.mobi` etc files by using [Markdown Preview Enhanced](https://github.com/shd101wyy/markdown-preview-enhanced) package. Documentation can be found [here](https://github.com/shd101wyy/markdown-preview-enhanced/blob/master/docs/ebook.md).