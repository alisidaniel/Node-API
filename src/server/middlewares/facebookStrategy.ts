import facebookStrategy from 'passport-facebook';
import config from '../../config/config';

const FacebookStrategy = facebookStrategy.Strategy;

export default new FacebookStrategy(
    {
        clientID: config.passport.fbId,
        clientSecret: config.auth.jwt,
        callbackURL: config.passport.callbackUrl,
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email'],
        passReqToCallback: true
    },
    (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        // do magic here
    }
);
