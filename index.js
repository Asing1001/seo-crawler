const { scheduleJob } = require('node-schedule');
const moment = require('moment');
const { start } = require('./crawler');
const { tasks } = require('./config');

function run() {
    console.log(`Find ${tasks.length} tasks`);
    const now = moment();
    const startMinute = now.minute() + 1;
    tasks.forEach((task, index) => {
        const startHour = (now.hour() + (index * 2)) % 24;
        console.log(`task ${index} created, startTime: ${startHour}:${startMinute}`);
        scheduleJob(`${startMinute} ${startHour} * * *`, async function () {
            console.log(`task ${JSON.stringify(task)} start!`);
            await start(task)
        });
    })
}

run()
