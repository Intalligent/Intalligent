var mongoose = require('mongoose')
    , LocalStrategy = require('passport-local').Strategy;

var Users = connection.model('Users');

module.exports = function (passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findOne({ _id: id }, function (err, user) {
            if (user) {
                user = user.toObject();

                done(err, user);
            }
            else {
                done(err, user);
            }
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            Users.isValidUserPassword(username, password, done);
        }));
}


exports.isAuthenticated = function (req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

exports.userExist = function(req, res, next) {
    Users.count({
        email: req.body.email
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            res.redirect("/signup");
        }
    });
}