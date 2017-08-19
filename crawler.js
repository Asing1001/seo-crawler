const { URL } = require('url');
const { Chromeless } = require('chromeless')
const { outputFile } = require('fs-extra');
const cheerio = require('cheerio');
const moment = require('moment');
const queue = require('async/queue');

const distFolder = 'dist/'
const visitHash = {};
let startUrl;
let _userAgent;
let q = queue(async function (task, callback) {
    await task.crawlPage(task.url);
}, 50);

async function start({ url, userAgent }) {
    return new Promise((resolve, reject) => {
        _userAgent = userAgent;
        startUrl = new URL(url);
        visitHash[url] = true;
        console.time(`Crawl ${url} finish in`);
        q.push({ crawlPage, url })
        q.drain = async () => {
            console.timeEnd(`Crawl ${url} finish in`);
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
                .setUserAgent(_userAgent)
                .goto(url)
                .html()
            console.timeEnd(`Crawl ${url}`)
            const $ = cheerio.load(html)
            const $urls = $('a[href]')
            console.log(`find url count :${$urls.length}`);
            $urls.each((index, anchor) => {
                const { href } = new URL($(anchor).attr('href'), startUrl.origin);
                if (sameOrigin(href) && !visitHash[href] && Object.keys(visitHash).length < 30) {
                    visitHash[href] = true;
                    q.push({ crawlPage, url: href })
                }
            })

            const uri = new URL(url);
            console.log(`visitHash length : ${Object.keys(visitHash).length}`);
            await outputFile(`${distFolder}${uri.pathname}.html`, html);
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

const sameOrigin = (href) => href.indexOf(startUrl.origin) !== -1

const generateSiteMap = () => {
    const freq = 'daily';
    let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const dateFileName = moment().format('DD-MM-YYYY-HH-mm-ss-')
    const filename = `${distFolder}${dateFileName}sitemap.xml`
    for (let url in visitHash) {
        //need to replace all '&', otherwise googleBot will consider it as broken sitemap.xml
        const urlForXML = url.replace(/&/g, '&amp;');
        xml += `<url>\n<loc>${urlForXML}</loc>\n<changefreq>${freq}</changefreq>\n</url>\n`;
    }
    xml += '</urlset>';
    return outputFile(filename, xml);
}

module.exports = { crawlPage, start, makeValidFileName }