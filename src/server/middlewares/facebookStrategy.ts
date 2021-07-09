import facebookStrategy from 'passport-facebook';
import config from '../../config/config';
import { userExist } from '../../utils';
import { consumeEmailJob } from '../jobs/email/consumeJob';
import mailJob from '../jobs/email/emailJob';
import { USER_EXIST } from '../types/messages';
import { BAD_REQUEST, SUCCESS } from '../types/statusCode';
import User from './../models/userModel';

const FacebookStrategy = facebookStrategy.Strategy;

export default new FacebookStrategy(
    {
        clientID: config.passport.fbId,
        clientSecret: config.auth.jwt,
        callbackURL: config.passport.callbackUrl,
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email'],
        passReqToCallback: true
    },
    async (req: any, accessToken: string, refreshToken: string, profile: any, cb: any) => {
        const { first_name, last_name, email } = profile._json;
        const isUser = await userExist(email);
        if (isUser) throw Error('User already exist');

        const userResponse = new User({
            firstName: first_name,
            lastName: last_name,
            email
        });
        await userResponse.save();
        console.log(userResponse);

        // Dispatch email
        const userId = userResponse._id;
        const type = 'Confirm Email';
        const title = 'Thank you for registering with Midlman';
        const emailQueue = new mailJob('emailQueue');
        emailQueue.addJob('EmailVerification', { email, userId, type, title });
        emailQueue.consumeJob('EmailVerification', await consumeEmailJob);
    }
);
