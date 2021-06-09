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
import couponRouter from './server/routes/couponRoute';
import roleRouter from './server/routes/roleRoute';
import brandRouter from './server/routes/brandRoute';
import blogRouter from './server/routes/blogRoute';
import setttingRouter from './server/routes/settingRoute';

import { corsOptions, errorRequest, logger } from './utils';
import strategy from 'passport-facebook';
import facebookStrategy from './server/middlewares/facebookStrategy';
// import config from './config/config'

const FacebookStrategy = strategy.Strategy;
const app: Application = express();

//*  MIDDLEWARES */
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
const baseRoute = '/api/v1';
app.use(`${baseRoute}/auth`, authRouter);
app.use(`${baseRoute}/admin`, adminRoute);
app.use(`${baseRoute}/user`, userRoute);
app.use(`${baseRoute}/category`, categoryRouter);
app.use(`${baseRoute}/product`, productRouter);
app.use(`${baseRoute}/cart`, cartRouter);
app.use(`${baseRoute}/order`, orderRouter);
app.use(`${baseRoute}/dispute`, disputeRouter);
app.use(`${baseRoute}/coupon`, couponRouter);
app.use(`${baseRoute}/role`, roleRouter);
app.use(`${baseRoute}/brand`, brandRouter);
app.use(`${baseRoute}/blog`, blogRouter);
app.use(`${baseRoute}/setting`, setttingRouter);

passport.use(`${baseRoute}/auth/facebook`, facebookStrategy);

app.use(errorHandler);

// ERROR LOG HANDLER
app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));
app.use(errorRequest);

//* SERVER */
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);

io.on('connection', function (socket: any) {
    console.log('a user connected');
    socket.on('message', function (message: any) {
        console.log(message);
        io.emit('message', message);
    });
    socket.on('disconnect', function () {
        console.log('a user disconnected');
    });
});

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
