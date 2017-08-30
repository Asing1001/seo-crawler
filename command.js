const { exec } = require('child_process');
const logger = require('./logger');

async function runChromeHeadless() {
    return new Promise(resolve => {
        const cmd = '"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" --remote-debugging-port=9222 --disable-gpu --headless';
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
