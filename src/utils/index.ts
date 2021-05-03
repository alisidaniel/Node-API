import errorRequest from './errorRequest';
import logger from './errorExecptionLogger';
import corsOptions from './corsPermissions';
import { hashPassword, validatePassword } from './hashPassword';
import { userExist } from './userExist';
import { getUserFromToken, getUserFromDatabase } from './findUser';
import { createConfirmationUrl } from './createConfirmationUrl';
import { sendEmail } from './sendMail';

export {
    //
    errorRequest,
    logger,
    corsOptions,
    hashPassword,
    validatePassword,
    userExist,
    getUserFromDatabase,
    getUserFromToken,
    createConfirmationUrl,
    sendEmail
};
