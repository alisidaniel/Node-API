import { sendEmail, createConfirmationUrl } from '../../../utils';

interface IProps {
    email: string;
    userId: string;
    type: string;
    title: string;
}

export const consumeEmailJob = async ({ email, userId, type, title }: IProps) => {
    console.log({ email, userId, type, title });
    try {
        await sendEmail(email, await createConfirmationUrl(userId), type, title);
    } catch (e) {
        throw new Error(e);
    }
};
