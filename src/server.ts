// MODULE IMPORTS
import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import 'module-alias/register';
import morgan from 'morgan';
import passport from 'passport';
import config from './config/config';
import database from './database/connection';
//  ERROR HANDLER MIDDLEWARE
import errorHandler from './server/middlewares/errorHandler';
import adminRoute from './server/routes/adminRoute';
// ROUTERS
import authRouter from './server/routes/authRoute';
import userRoute from './server/routes/userRoute';
import { corsOptions, errorRequest, logger } from './utils';

const app: Application = express();

//*  MIDDLEWARES */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(errorHandler);
app.use(passport.initialize());
app.use(passport.session());

const baseRoute = '/api/v1';

app.use(`${baseRoute}/auth`, authRouter);
app.use(`${baseRoute}/admin`, adminRoute);
app.use(`${baseRoute}/user`, userRoute);

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
