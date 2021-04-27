// MODULE IMPORTS
import 'module-alias/register';
import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import config from '@config/config';
import corsOptions from '@utils/corsPermissions';

const app: Application = express();

//*  MIDDLEWARES */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

//* SERVER */
const httpServer = http.createServer(app);
try {
    httpServer.listen(config.server.port, () => {
        console.info(`Server running on port: ${config.server.port}`);
    });
} catch (err) {
    console.log(err);
}
