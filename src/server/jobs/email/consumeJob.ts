import { sendEmail, createConfirmationUrl } from '../../../utils';

export const consumeEmailJob = async (data: any) => {
    try {
        await sendEmail(data.email, await createConfirmationUrl(data.id), data.type, data.title);
    } catch (e) {
        throw new Error(e);
    }
};
