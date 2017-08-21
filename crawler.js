const { URL } = require('url');
const { Chromeless } = require('chromeless')
const { outputFile } = require('fs-extra');
const cheerio = require('cheerio');
const moment = require('moment');
const queue = require('async/queue');
const { crawlerSetting: { userAgent } } = require('./config');

const visitHash = {};
let _distFolder, startUri;
let q = queue(async function (task, callback) {
    await task.crawlPage(task.url);
}, 50);

async function start({ startUrl, distFolder }) {
    return new Promise((resolve, reject) => {
        _distFolder = distFolder;
        startUri = new URL(startUrl);
        visitHash[startUrl] = true;
        console.time(`Crawl ${startUrl} finish in`);
        q.push({ crawlPage, url: startUrl })
        q.drain = async () => {
            console.timeEnd(`Crawl ${startUrl} finish in`);
            console.log(`Total page visited : ${Object.keys(visitHash).length}`)
            await generateSiteMap();
            resolve()
        };
    })
}

async function crawlPage(url) {
    return new Promise(async (resolve, reject) => {
        try {
            console.time(`Crawl ${url}`)
            const chromeless = new Chromeless()
            const html = await chromeless
                .setUserAgent(userAgent)
                .goto(url)
                .html()
            console.timeEnd(`Crawl ${url}`)
            const $ = cheerio.load(html)
            const $urls = $('a[href]')
            console.log(`find url count :${$urls.length}`);
            $urls.each((index, anchor) => {
                const { href } = new URL($(anchor).attr('href'), startUri.origin);
                if (sameOrigin(href) && !visitHash[href]) {
                    visitHash[href] = true;
                    q.push({ crawlPage, url: href })
                }
            })

            const uri = new URL(url);
            console.log(`visitHash length : ${Object.keys(visitHash).length}`);
            await outputFile(`${_distFolder}${uri.pathname}.html`, html);
            await chromeless.end()
        }
        catch (err) {
            console.error(err)
        }
        finally {
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
    const dateFileName = moment().format('DD-MM-YYYY-HH-mm-ss-')
    const filename = `${_distFolder}${dateFileName}sitemap.xml`
    for (let url in visitHash) {
        //need to replace all '&', otherwise googleBot will consider it as broken sitemap.xml
        const urlForXML = url.replace(/&/g, '&amp;');
        xml += `<url>\n<loc>${urlForXML}</loc>\n<changefreq>${freq}</changefreq>\n</url>\n`;
    }
    xml += '</urlset>';
    return outputFile(filename, xml);
}

module.exports = { crawlPage, start, makeValidFileName }