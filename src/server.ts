// MODULE IMPORTS
import 'module-alias/register';
import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import config from './config/config';
import database from './database/connection';

import morgan from 'morgan';
import { errorRequest, logger, corsOptions } from './utils';

// ROUTERS
import authRouter from './server/routes/authRoute';
import errorHandler from './server/middlewares/errorHandler';

const app: Application = express();

//*  MIDDLEWARES */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(errorHandler);

app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/product', pro)

// ERROR LOG HANDLER
app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));
app.use(errorRequest);

//* SERVER */
const httpServer = http.createServer(app);

database
    .then(function (res: any) {
        console.log('Database connected::successfully');
    })
    .catch(function (err: any) {
        console.log('Database error:', err);
    });

try {
    httpServer.listen(config.server.port, () => {
        console.info(`Server running on port: ${config.server.port}`);
    });
} catch (err) {
    console.log(err);
}
