const { exec } = require('child_process');
const logger = require('./logger');
const Downloader = require('./utils/ChromiumDownloader');
const platform = Downloader.currentPlatform();
const revision = require('./package').puppeteer.chromium_revision;
const revisionInfo = Downloader.revisionInfo(platform, revision);

async function runChromeHeadless() {
    return new Promise(resolve => {
        const chromePath = revisionInfo.executablePath;
        const cmd = `"${chromePath}" --remote-debugging-port=9222 --disable-gpu --headless`;
        const option = {
            timeout: 2000
        }
        exec(cmd, option, (err, stdout, stderr) => {
            if (err) {
                logger.error('reInitChrome throw error', err);
            }
            logger.info('stdout:', stdout);
            logger.error('stderr:', stderr);
            resolve();
        })
    })
}

async function killChrome() {
    return new Promise(resolve => {
        exec('taskkill /F /IM chrome.exe', (err, stdout, stderr) => {
            if (err) {
                logger.error('killChrome throw error', err);
            }
            logger.info('stdout:', stdout);
            logger.error('stderr:', stderr);
            resolve();
        })
    })
}

module.exports = { runChromeHeadless, killChrome }
