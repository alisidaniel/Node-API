import winston from 'winston';
import path from 'path';
import config from '../config/config';

let logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'error-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({
            filename: `${path.join(__dirname, '../storage/logs/error.log')}`,
            level: 'error'
        }),
        new winston.transports.File({
            filename: `${path.join(__dirname, '../storage/logs/combined.log')}`
        })
    ]
});

if (config.node_env !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple()
        })
    );
}

export default logger;
