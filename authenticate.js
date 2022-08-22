const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./Models/users');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new LocalStrategy(Users.authenticate()));
exports.authenticateLocal = (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err) return next(err);
        if(!user) return res.status(401).json(info);
        req.user = user;
        next();
    }) (req, res, next);
}

// passport.serializeUser(Users.serializeUser());
// passport.deserializeUser(Users.deserializeUser());
exports.getToken = (user) => {
    return jwt.sign(user, process.env.SECRET_KEY, {expiresIn: 3600});
};


// extract jwt for passport to use jwt strategy in line 23
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
};
// it is called when authenticate jwt middleware is called
exports.jwtPassport = passport.use(new JwtStrategy(options, async (payload, done) => {
    const user = await Users.findOne({_id: payload._id});
    return user ? done(null, user) : done(null, false);
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (!req.user.admin) res.status(403).json('Not authorized to do');
    else next();
}


exports.facebookPassport = passport.use(new FacebookTokenStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await Users.findOne({facebookId: profile.id});
            // if user already exist
            if (user) return done(null, user);

            const newUser = Users.create({
                username: profile.id,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                facebookId: profile.id,
            });
            return done(null, newUser);
        } catch (err) {
            return done(err, false);
        }
    }
));