const tasks = [{
    distFolder: 'C:/Agilebet/share/uksnapshot/',
    startUrl: 'https://www.188bet.co.uk/en-gb',
    maxDurationInHour: 2
}, {
    distFolder: 'C:/Agilebet/share/uksnapshot.mobile/',
    startUrl: 'https://m.188bet.co.uk/en-gb',
    maxDurationInHour: 2    
}, {
    distFolder: 'C:/Agilebet/share/snapshot/',
    startUrl: 'https://www.188bet.com/en-gb',
    maxDurationInHour: 3    
}, {
    distFolder: 'C:/Agilebet/share/snapshot.mobile/',
    startUrl: 'https://m.188bet.com/en-gb',
    maxDurationInHour: 2    
}]

const crawlerSetting = {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) seo.crawler',
    maxInstance: 20
}

module.exports = { tasks, crawlerSetting }