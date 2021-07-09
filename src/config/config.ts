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
const FACEBOOK_APP_ID: string = process.env.FACEBOOK_APP_ID || '2415099155293997';
const AWS_SECRET: string = process.env.AWS_SECRET || 'YVcBBxATC9AvSsKrDTjU1Q4+dcs6hX4FdbQAycQg';
const AWS_ACCESS_ID: string = process.env.AWS_ACCESSID || 'AKIAZDSUDEPVBSDI5US5';
const S3_BUCKET_NAME: string = process.env.S3_BUCKET_NAME || 'midlman';
const S3_HOST_URL: string = process.env.S3_HOST_URL || 'https://midlman.s3.eu-west-3.amazonaws.com';
const S3_REGION: string = process.env.S3_REGION || 'eu-west-3';
const PAYSTACK_URL: string = process.env.PAYSTACK_URL || 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY: string =
    process.env.PAYSTACK_SECRET_KEY || 'sk_test_14c14e0ceb2c7213be160b9a927f49158c58cea7';
const PAYSTACK_PUBLIC_KEY: string =
    process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_ad8e5e2d5142e9538618a7cb9acf5413b2b02dfc';

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

const PASSPORT = {
    fbId: FACEBOOK_APP_ID,
    callbackUrl: `${FRONTEND_URL}/auth/facebook`
};

const AWS = {
    AWS_SECRET: AWS_SECRET,
    AWS_ACCESS_ID: AWS_ACCESS_ID,
    AWS_BUCKET: S3_BUCKET_NAME,
    AWS_HOST: S3_HOST_URL,
    AWS_REGION: S3_REGION
};

const PAYSTACK = {
    url: PAYSTACK_URL,
    secret_key: PAYSTACK_SECRET_KEY,
    public_key: PAYSTACK_PUBLIC_KEY
};

const config = {
    server: SERVER,
    mongo: MONGO,
    url: URL,
    auth: SECRET,
    node_env: NODE_ENV,
    redis: REDIS,
    passport: PASSPORT,
    aws: AWS,
    paystack: PAYSTACK
    // others ...
};

export default config;
