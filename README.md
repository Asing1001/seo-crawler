# seo-crawler

This project is for crawl full website with javascript excuted by headless chrome.
Search engine crawler won't excute javascript for your website, but mordern web use lots of javascript. As a result it can not be indexed correctly by search engine, hence we use this project to crawl our site then serve htmls to search engine crawler.

## Run Chrome headless-ly on Windows

```bash
cd "C:\Program Files (x86)\Google\Chrome\Application"
chrome --remote-debugging-port=9222 --disable-gpu --headless
```

## Developement

```
# install package
npm install

# start program
npm start

# test
npm test

# test in watch mode
npm run test:w

```

## Others

In case you need to kill chrome process : `taskkill /F /IM chrome.exe`

## References

[Chromeless](https://github.com/graphcool/chromeless)