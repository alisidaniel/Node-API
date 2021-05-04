import { sendEmail, createConfirmationUrl } from '../../../utils';

export const consumeEmailJob = async (data: any) => {
    try {
        await sendEmail(
            data.email,
            await createConfirmationUrl(data.id),
            'Confirm Email',
            'Thank you for registering with Midlman'
        );
    } catch (e) {
        throw new Error(e);
    }
};
