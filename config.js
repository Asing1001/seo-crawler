const tasks = [{
    distFolder: 'C:/Agilebet/share/snapshot/',
    startUrl: 'https://www.188bet.com/en-gb'
}, {
    distFolder: 'C:/Agilebet/share/snapshot.mobile/',
    startUrl: 'https://m.188bet.com/en-gb'
}, {
    distFolder: 'C:/Agilebet/share/uksnapshot/',
    startUrl: 'https://www.188bet.co.uk/en-gb'
}, {
    distFolder: 'C:/Agilebet/share/uksnapshot.mobile/',
    startUrl: 'https://m.188bet.co.uk/en-gb'
}]

const crawlerSetting = {
    userAgent : 'Mozilla/5.0 (Macintosh; Intel Mac OS X) seo.crawler',
    maxInstance : 30
}

module.exports = { tasks, crawlerSetting }