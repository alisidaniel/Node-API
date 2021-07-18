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
import cardRouter from './server/routes/cardRoute';
import bankRouter from './server/routes/bankRoute';
import walletRouter from './server/routes/walletRoute';
import flateRateRouter from './server/routes/flateRateRoute';
import contactRouter from './server/routes/contactRoute';
import webRouter from './server/routes/webRoute';

import { corsOptions, errorRequest, logger } from './utils';
import strategy from 'passport-facebook';
import facebookStrategy from './server/middlewares/facebookStrategy';
// import { ChatEvent } from 'server/types/socket';
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
app.use(`${baseRoute}/bank`, bankRouter);
app.use(`${baseRoute}/card`, cardRouter);
app.use(`${baseRoute}/wallet`, walletRouter);
app.use(`${baseRoute}/flatRate`, flateRateRouter);
app.use(`${baseRoute}/contact`, contactRouter);
app.use(`${baseRoute}/content`, webRouter);

passport.use(`${baseRoute}/auth/facebook`, facebookStrategy);

app.use(errorHandler);

// ERROR LOG HANDLER
app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));
app.use(errorRequest);

//* SERVER */
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);

// io.on('connection', function (socket: any) {
//     console.log('a user connected');

//     socket.on(ChatEvent.CONNECT, () => {
//         console.log('a user connected');
//     });
//     socket.on(ChatEvent.MESSAGE, function (message: any) {
//         console.log(message);
//         io.emit('message', message);
//     });
//     socket.on(ChatEvent.DISCONNECT, function () {
//         console.log('a user disconnected');
//     });
// });

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
