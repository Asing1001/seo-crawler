const { URL } = require('url');
const { Chromeless } = require('chromeless')
const { outputFile } = require('fs-extra');
const cheerio = require('cheerio');
const moment = require('moment');
const queue = require('async/queue');
const logger = require('./logger');
const { crawlerSetting: { userAgent, maxInstance } } = require('./config');

let _distFolder, startUri;
let visitHash = {};
let q = queue(async function (task, callback) {
    await crawlPage(task.url);
    return;
}, maxInstance);

async function initialize({ startUrl, distFolder = 'dist/' }) {
    await cleanUp();
    return new Promise((resolve, reject) => {
        _distFolder = distFolder;
        startUri = new URL(startUrl);
        visitHash[startUrl] = true;
        logger.profile(`Crawl ${startUrl}`);
        q.push({ crawlPage, url: startUrl })
        q.drain = async () => {
            logger.profile(`Crawl ${startUrl}`);
            logger.info(`Total page visited : ${Object.keys(visitHash).length}`)
            resolve()
        };
    })
}

async function cleanUp() {
    if (Object.keys(visitHash).length > 0) {
        await generateSiteMap();
        visitHash = {};
    }

    if (q.running() > 0) {
        logger.warn(`Pages not completed : ${q.workersList()}`)
        q.kill()
    }
}

async function crawlPage(url) {
    return new Promise(async (resolve, reject) => {
        try {
            logger.profile(`Crawl ${url}`)
            const chromeless = new Chromeless()
            const html = await chromeless
                .setUserAgent(userAgent)
                .goto(url)
                .evaluate(() => {
                    Array.from(document.querySelectorAll('script'))
                        .forEach(script => script.parentNode.removeChild(script))
                })
                .html()
            logger.profile(`Crawl ${url}`)
            const $ = cheerio.load(html)
            const $urls = $('a[href]')
            logger.debug(`find url count :${$urls.length}`);
            $urls.each((index, anchor) => {
                const { href } = new URL($(anchor).attr('href'), startUri.origin);
                if (sameOrigin(href) && !visitHash[href]) {
                    visitHash[href] = true;
                    q.push({ url: href })
                }
            })

            logger.debug(`visitHash length : ${Object.keys(visitHash).length}, q.length() : ${q.length()}, q.running() : ${q.running()}`);
            const uri = new URL(url);
            await outputFile(`${_distFolder}${uri.pathname}.html`, html);
            await chromeless.end()
            resolve()
        }
        catch (err) {
            logger.error(err)
            resolve()
        }
    })
}

const invalidFileNameRegex = /[<>:"\\\/\|\?\*]+/g
const makeValidFileName = (url) => {
    const uri = new URL(url);
    return uri.pathname + uri.search.replace(invalidFileNameRegex, '_')
}

const sameOrigin = (href) => href.indexOf(startUri.origin) !== -1

const generateSiteMap = () => {
    const freq = 'daily';
    let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const dateFileName = moment().format('MM-DD-YYYY')
    const filename = `${_distFolder}${dateFileName}sitemap.xml`
    for (let url in visitHash) {
        //need to replace all '&', otherwise googleBot will consider it as broken sitemap.xml
        const urlForXML = url.replace(/&/g, '&amp;');
        xml += `<url>\n<loc>${urlForXML}</loc>\n<changefreq>${freq}</changefreq>\n</url>\n`;
    }
    xml += '</urlset>';
    return outputFile(filename, xml);
}

module.exports = { crawlPage, initialize, makeValidFileName }