import config from '@config/config';
import { CorsOptions } from 'cors';

const options: CorsOptions = {
    origin: config.url.clientUrl
};

export default options;
