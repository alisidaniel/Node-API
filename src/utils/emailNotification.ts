import { consumeEmailJob } from '../server/jobs/email/consumeJob';
import mailJob from '../server/jobs/email/emailJob';

export const emailNotify = async (
    type: string,
    email: string,
    userId: string,
    title: string,
    jobname: string
): Promise<void> => {
    try {
        const emailQueue = new mailJob('emailQueue');
        emailQueue.addJob(jobname, { email, userId, type, title });
        emailQueue.consumeJob(jobname, await consumeEmailJob);
    } catch (e) {
        throw new Error(e);
    }
};
