const moment = require('moment');
const { scheduleJob } = require('node-schedule');
const { initialize } = require('./crawler');
const { tasks } = require('./config');
const logger = require('./logger');
const { killChrome, runChromeHeadless } = require('./command');

function run() {
    logger.info(`Find ${tasks.length} tasks`);
    const startTime = moment().add(5, 'seconds');
    const startMinute = startTime.minute();
    const startSecond = startTime.second();
    let startHour = startTime.hour();
    tasks.forEach((task, index) => {
        if (index > 0) {
            startHour = (startHour + tasks[index - 1].maxDuration) % 24
        }
        logger.info(`Task ${task.startUrl} created, startTime: ${startHour}:${startMinute}:${startSecond}`);
        scheduleJob(`${startSecond} ${startMinute} ${startHour} * * *`, async function () {
            await killChrome();
            await runChromeHeadless();
            logger.info(`task ${JSON.stringify(task)} start!`);
            await initialize(task)
        });
    })
}

run();