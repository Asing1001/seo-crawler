# SEO crawler

Crawl your website with javascript excuted

## Why do you need this

Mordern web use lots of javascript but search engine crawler won't excute it. As a result pages can not be indexed correctly. So we  crawl our site with js-excuted and serve it to search engine crawler.

## Getting Start

### Install package
`npm install`

### Modify target website in [config.js](./config.js)
For example save html snapshot in `C:/snapshot/`, target website is `https://www.paddingleft.com/` 
```
const tasks = [{
    distFolder: 'C:/snapshot/',
    startUrl: 'https://www.paddingleft.com/'
}]
```

### Start program
`npm start`

## Developement

```

# Testing
npm test

# Testing in watch mode
npm run test:w

```

## Others

### Kill chrome process in command line
`taskkill /F /IM chrome.exe`

### Run Chrome headless-ly on Windows
```bash
cd "C:\Program Files (x86)\Google\Chrome\Application"
chrome --remote-debugging-port=9222 --disable-gpu --headless
```

## References

[Chromeless](https://github.com/graphcool/chromeless)
