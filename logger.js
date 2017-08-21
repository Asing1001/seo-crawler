const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const { ensureDir } = require('fs-extra');
const logsFolder = 'logs';
ensureDir(logsFolder)

const dailyRotateFile = new (winston.transports.DailyRotateFile)({
    filename: path.join(__dirname, logsFolder, './log'),
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false
});

const logger = new (winston.Logger)({
    transports: [
        dailyRotateFile,
        new winston.transports.Console({ colorize: true })
    ]
});

module.exports = logger;