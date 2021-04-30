import winston, { Logger, transports } from 'winston';
import path from 'path';
import config from '../config/config';

let options = {
    file: {
        level: 'info',
        filename: `${path.join(__dirname, '../storage/logs/error.log')}`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
};

let logger = winston.createLogger({
    transports: [
        new winston.transports.Console(options.console),
        new winston.transports.File(options.file)
    ],
    exitOnError: false // do not exit on handled exceptions
});

export default logger;
