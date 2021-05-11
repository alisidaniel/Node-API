import errorRequest from './errorRequest';
import logger from './errorExecptionLogger';
import corsOptions from './corsPermissions';
import { hashPassword, validatePassword } from './hashPassword';
import { userExist, adminExist } from './userExist';
import { getUserFromToken, getUserFromDatabase } from './findUser';
import { createConfirmationUrl } from './createConfirmationUrl';
import { sendEmail } from './sendMail';
import { multipleUpload, singleUpload } from './fileUpload';

export {
    //
    errorRequest,
    logger,
    corsOptions,
    hashPassword,
    validatePassword,
    userExist,
    adminExist,
    getUserFromDatabase,
    getUserFromToken,
    createConfirmationUrl,
    sendEmail,
    multipleUpload,
    singleUpload
};
