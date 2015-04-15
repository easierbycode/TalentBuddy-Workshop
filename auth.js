var _             = require('lodash'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    conn          = require('./db'),
    bcrypt        = require('bcrypt'),
    fixtures = require('./fixtures');




passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    conn.model('User').findOne({ id: id} , function(err, user) {
        done(err, user);
    });

});

function verify(username, password, done) {
    var User = conn.model('User');

    User.findOne({ id: username}, function(err, user) {
        if (err) {
            return done(err, null);
        }

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return err;
            }
            if(!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });

    });

}

passport.use(new LocalStrategy(verify));



module.exports = passport;