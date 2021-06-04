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
import categoryRouter from './server/routes/categoryRoute';
import productRouter from './server/routes/productRoute';
import cartRouter from './server/routes/cartRoute';
import orderRouter from './server/routes/orderRoute';
import disputeRouter from './server/routes/disputeRoute';

import { corsOptions, errorRequest, logger } from './utils';
// import fbStrategy from './server/middlewares/facebookStrategy';

const app: Application = express();

//*  MIDDLEWARES */
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cors(corsOptions));
app.use(errorHandler);
app.use(passport.initialize());
app.use(passport.session());
// app.use(fbStrategy);

const baseRoute = '/api/v1';

app.use(`${baseRoute}/auth`, authRouter);
app.use(`${baseRoute}/admin`, adminRoute);
app.use(`${baseRoute}/user`, userRoute);
app.use(`${baseRoute}/category`, categoryRouter);
app.use(`${baseRoute}/product`, productRouter);
app.use(`${baseRoute}/cart`, cartRouter);
app.use(`${baseRoute}/order`, orderRouter);
app.use(`${baseRoute}/dispute`, disputeRouter);

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
