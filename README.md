# SEO crawler

Crawl your website with javascript excuted

## Why do you need this ?

Mordern web use lots of javascript but search engine crawler won't excute it. As a result pages can not be indexed correctly. So we  crawl our site with js-excuted and serve it to search engine crawler.

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
