var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/userSchema");
const Article = require("../models/articleSchema")
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('../config');


exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAuthor = async (req, res, next)=>{
    const article = await Article.findById(req.params.articleID).populate('author')
    if(!article){
        res.status(403).json({ msg: 'Id not available' })
        return;
    }
    let userRequesting = req.user._id.toString()
    let articleAuthor = article.author._id.toString()

    if(userRequesting == articleAuthor){
        next()
    }
    else{
        res.status(403).json({ msg: 'You are not authorised to update this blog' })
    } 
}