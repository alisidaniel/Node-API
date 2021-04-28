// MODULE IMPORTS
import 'module-alias/register';
import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import config from '@config/config';
import database from '@database/connection';
import corsOptions from '@utils/corsPermissions';

// ROUTERS
import authRouter from "./server/routes/authRoute";

const app: Application = express();

//*  MIDDLEWARES */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/', authRouter);

//* SERVER */
const httpServer = http.createServer(app);

database.then(function(res:any){
    console.log("Database connected::successfully");
}).catch(function(err:any){
    console.log("Database error:", err);
})

try {
    httpServer.listen(config.server.port, () => {
        console.info(`Server running on port: ${config.server.port}`);
    });
} catch (err) {
    console.log(err);
}
