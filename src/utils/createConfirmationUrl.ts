import config from '../config/config';
export const createConfirmationUrl = async (userId: string) => {
    return `${config.url.clientUrl}/user/confirm/${userId}`;
};
