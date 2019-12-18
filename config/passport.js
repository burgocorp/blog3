const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const userModel = mongoose.model('user');


const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = passport => {
    passport.use(
        new jwtStrategy(opts, (jwt_payload, cb) => {
            userModel
                .findById(jwt_payload.id)
                .then(user => {
                    if (user){
                        return cb(null, user)
                    }else{
                        cb(null, false)
                    }
                })
                .catch(err => console.log(err));
        })
    );
};