import winston from 'winston';
import 'winston-mongodb';
import config from 'config';

const defaultConnection = config.get('db');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),

        new winston.transports.MongoDB({
            level: 'error',
            db: defaultConnection,
            collection: 'logs',
            format: winston.format.metadata()
        })
    ],
    exceptionHandlers: [
        new winston.transports.MongoDB({
            db: defaultConnection,
            collection: 'exceptions',
        }),
        new winston.transports.File({ filename: 'exceptions.log' })
    ]
});

export default logger;
