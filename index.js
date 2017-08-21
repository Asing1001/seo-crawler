const moment = require('moment');
const { scheduleJob } = require('node-schedule');
const { start } = require('./crawler');
const { tasks } = require('./config');
const logger = require('./logger');

function run() {
    logger.info(`Find ${tasks.length} tasks`);
    const now = moment();
    const startMinute = now.minute() + 1;
    tasks.forEach((task, index) => {
        const startHour = (now.hour() + (index * 2)) % 24;
        logger.info(`task ${index} created, startTime: ${startHour}:${startMinute}`);
        scheduleJob(`${startMinute} ${startHour} * * *`, async function () {
            logger.info(`task ${JSON.stringify(task)} start!`);
            await start(task)
        });
    })
}

run();