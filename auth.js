var _             = require('lodash'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    conn          = require('./db');
    fixtures = require('./fixtures');




passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    conn.model('User').findOne({ id: id} , function(err, user) {
        done(err, user);
    });
    /*var user = _.find(fixtures.users, 'id', id );
    if (!user) {
        return done(null, false);
    }
    done(null, user);*/
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

        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    });
    /*var user = _.find(fixtures.users, 'id', username);

    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }

    if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
    }

    done(null, user);*/
}

passport.use(new LocalStrategy(verify));



module.exports = passport;