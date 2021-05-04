import dotenv from 'dotenv';

dotenv.config();

// ENV KEY VARIABLES
const SERVER_PORT: number = parseInt(<string>process.env.SERVER_PORT, 10) || 5000;
const SERVER_HOST_NAME: string = process.env.SERVER_HOST_NAME || 'localhost';
const MONGO_URL: string = process.env.MONGO_URL!;
const JWT_SECRET: string = process.env.JWT_SECRET || 'somerandomtextinmidlman';
const FRONTEND_URL: string = process.env.FRONTEND_URL || 'http://localhost:3000';
const NODE_ENV: string = process.env.NODE_ENV || 'development';
const REDIS_PORT: number = parseInt(<string>process.env.REDIS_PORT, 10) || 6379;
const REDIS_HOST: string = process.env.REDIS_HOST || '13.59.49.204';
const REDIS_DB: number = parseInt(<string>process.env.REDIS_DB, 10) || 3;
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || 'mypassword';

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

const REDIS = {
    PORT: REDIS_PORT,
    HOST: REDIS_HOST,
    DB: REDIS_DB,
    PASSWORD: REDIS_PASSWORD
};

const config = {
    server: SERVER,
    mongo: MONGO,
    url: URL,
    auth: SECRET,
    node_env: NODE_ENV,
    redis: REDIS
    // others ...
};

export default config;
