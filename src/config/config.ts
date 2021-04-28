import dotenv from 'dotenv';

dotenv.config();

// ENV KEY VARIABLES
const SERVER_PORT: Number = parseInt(<string>process.env.SERVER_PORT, 10) || 5000;
const SERVER_HOST_NAME: string = process.env.SERVER_HOST_NAME || 'localhost';
const MONGO_URL: string = process.env.MONGO_URL!;
const JWT_SECRET: string = process.env.JWT_SECRET || 'somerandomtextinmidlman';
const FRONTEND_URL: string = process.env.FRONTEND_URL || 'http://localhost:3000';

const SERVER = {
    hostname: SERVER_HOST_NAME,
    port: SERVER_PORT
};

const MONGO = {
    url: MONGO_URL
    // others ...
};

const SECRET = {
    jwt: JWT_SECRET
    // others ...
};

const URL = {
    clientUrl: FRONTEND_URL
};

const config = {
    server: SERVER,
    mongo: MONGO,
    url: URL
    // others ...
};

export default config;
