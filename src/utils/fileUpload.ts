import AWS from 'aws-sdk';
import config from '../config/config';
import { fileExtention, requiredExtentions } from './fileValidation';

AWS.config.update({
    accessKeyId: config.aws.AWS_ACCESS_ID,
    secretAccessKey: config.aws.AWS_SECRET,
    region: config.aws.AWS_REGION
});

const s3 = new AWS.S3();

interface IPropImages {
    base64Array: any;
    productId: string;
}

interface IPropImage {
    base64: any;
    id: string;
    path: string;
    type: string;
}

export const multipleUpload = async ({ base64Array, productId }: IPropImages) => {
    try {
        //generate random variable names
        const arr = [2, 1, 4, 'cat', false];
        // promiseVar array is "holder" of dynamic variables
        let promiseVar: any = [];
        // loop and generate dynamic variable names
        for (var i = 0; i < base64Array.length; i++) {
            promiseVar['promise' + arr[i]] = [i];
        }

        //this will hold all the promises
        let promises = [];
        for (let i = 0; i < base64Array.length; i++) {
            promiseVar[i] = new Promise((res, rej) => {
                const timestamp = new Date().valueOf();
                let base64 = base64Array[i];
                // const buf = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                // const type = base64.split(';')[0].split('/')[1];
                const buf = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                const type = fileExtention(base64);
                if (!requiredExtentions(type)) throw new Error('Image type not supported.');
                const putParams = {
                    Bucket: config.aws.AWS_BUCKET,
                    Key: `${productId}/productImages/${timestamp}-midlmanImage.${type}`,
                    Body: buf,
                    ACL: 'public-read',
                    ContentEncoding: 'base64',
                    ContentType: `image/${type}`
                };
                s3.putObject(putParams, function (err, data) {
                    if (err) {
                        rej(err.message);
                    } else {
                        res(
                            `${config.aws.AWS_HOST}/${productId}/productImages/${timestamp}-midlmanImage.${type}`
                        );
                    }
                });
            });
            //push the promise to the promises array
            promises.push(promiseVar[i]);
        }

        return Promise.all(promises)
            .then((dataValues) => {
                return dataValues;
            })
            .catch((errValues) => {
                console.log(errValues);
                throw new Error(errValues[0]);
            });
    } catch (e) {
        console.log(e.message);
        throw new Error(e);
    }
};

export const singleUpload = async ({ base64, id, path, type }: IPropImage) => {
    try {
        const timestamp = new Date().valueOf();
        return new Promise((res, rej) => {
            // new Buffer.from(base64.replace(/^9j/, ''), 'base64')
            let buf;
            if (type === 'image') {
                buf = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            }
            if (type === 'video') {
                buf = Buffer.from(base64.replace(/^data:video\/\w+;base64,/, ''), 'base64');
            }

            const Extention = fileExtention(base64);
            if (!requiredExtentions(Extention)) throw new Error('Image type not supported.');
            const putParams = {
                Bucket: config.aws.AWS_BUCKET,
                Key: `${id}/${path}/${timestamp}.${Extention}`,
                Body: buf,
                ACL: 'public-read',
                ContentEncoding: 'base64',
                ContentType: `${type}/${Extention}`
            };
            s3.putObject(putParams, function (err, data) {
                if (err) {
                    console.log('Could not upload the file. Error :', err.message);
                    rej(err.message);
                } else {
                    console.log('Successfully channel logo');
                    //construct the publicly accessible url and send the url
                    res(`${config.aws.AWS_HOST}/${id}/${path}/${timestamp}.${Extention}`);
                }
            });
        })
            .then((data) => {
                return data;
            })
            .catch((err) => {
                throw new Error(err);
            });
    } catch (e) {
        throw new Error(e);
    }
};
