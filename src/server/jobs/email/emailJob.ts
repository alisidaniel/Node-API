import Queue from 'bull';
import config from '../../../config/config';
export default class mailJobScheule {
    queueName: any;
    constructor(queueName: any) {
        this.queueName = new Queue(queueName, {
            redis: {
                port: config.redis.PORT,
                host: config.redis.HOST,
                db: config.redis.DB,
                password: config.redis.PASSWORD
            }
        });

        this.queueName.on('global:completed', (jobId: any) => {
            console.log(`::job with id ${jobId} has been completed`);
        });

        this.queueName.on('error', (err: any) => {
            console.log(
                '::An error occured in performing action please try again in a short while',
                err.message
            );
        });
    }

    addJob(jobName: string, jobData: any) {
        return this.queueName.add(jobName, jobData);
    }

    consumeJob(jobName: string, jobFunction: any) {
        return this.queueName.process(jobName, async (job: any, done: any) => {
            console.log('::job data ', job.name);
            await jobFunction(job.data);
            done();
        });
    }
}
