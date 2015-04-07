

var express      = require('express'),
    config       = require('./config'),
    session      = require('express-session'),
    fixtures     = require('./fixtures'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    shortId      = require('shortid'),
    _            = require('lodash'),
    passport     = require('./auth'),
    conn         = require('./db');


var app    = express();



app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


var ensureAuthentication = function() {
    return function auth(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }
        next();
    };

};




app.get('/api/tweets', function(req, res){
    if(!req.query.userId) {
        return res.sendStatus(400);
    }
    var tweets = _.where(fixtures.tweets, { userId: req.query.userId });
    var sortedTweets = tweets.sort(function(a, b) {
        return b.created - a.created;
    });
    res.send({tweets: sortedTweets});

});

app.get('/api/users/:userId', function(req, res) {
    var userId = req.params.userId,
        User   = conn.model('User');

    User.findOne({id: userId}, function(err, user) {
        if (!user) {
            return res.sendStatus(404);
        }
        res.status(200).json({ user: user});
    });

    /*var user = _.find(fixtures.users, 'id', req.params.userId);

    if(!user) {
        return res.sendStatus(404)
    }
    res.send({ user: user});*/

});




app.put('/api/users/:userId', ensureAuthentication(), function(req, res) {
    var User   = conn.model('User');
    if (req.user.id !== req.params.userId) {
        return res.sendStatus(403);
    }
    User.findOneAndUpdate({ id: req.params.userId }, { password: req.body.password }, function(err, user) {
        console.log(user);
        return res.sendStatus(200);
    });
});

app.post('/api/users', function(req, res)  {
    var newUser = req.body.user;
    var User   =  conn.model('User');

    User.create(newUser, function(err, newUser) {
        if (err) {
            var code = err.code === 11000 ? 409 : 500;
            return res.sendStatus(code);
        }
        req.login(newUser, function(err) {
            if (err) {
                return res.sendStatus(500);
            }

            res.sendStatus(200);
        });
    });


    /*if(_.find(fixtures.users, 'id', user.id)) {
        return res.sendStatus(409);
    }
    user.followingIds = [];
    fixtures.users.push(user);
    req.login(user, function(err) {
        if (err) {
            return err;
        }
        console.log(req.session);
        res.sendStatus(200);
    });*/
});


app.post('/api/tweets', function(req, res) {

    var tweet = req.body.tweet;

    tweet.created = Date.now() / 1000 | 0;
    
    res.send({tweet: tweet });

});

app.get('/api/tweets/:tweetId', function(req, res) {
    var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);

    if (!tweet) {
        return res.sendStatus(404);
    }

    res.send({ tweet: tweet });

});



app.delete('/api/tweets/:tweetId', ensureAuthentication(), function(req, res) {
    var pendtweet = _.find(fixtures.tweets, 'id', req.params.tweetId);
    if(pendtweet.length === 0) {
        return res.sendStatus(404);
    }
    if(pendtweet.userId === req.user.id) {
        _.remove(fixtures.tweets, 'id', pendtweet.id);
        return res.sendStatus(200);
    }
    return res.sendStatus(403);
});

app.post('/api/auth/login', function(req, res) {
    //console.log(req.body);
    passport.authenticate('local', function(err, user, info) {
        if(err) {
            return res.sendStatus(500);
        }
        if(info) {
            return res.sendStatus(403);
        }
        req.login(user, function(err) {
            if (err) {
                return res.sendStatus(500);
            }
            return res.send({ user: user });
        });
    })(req, res);
});

app.post('/api/auth/logout', function(req, res) {
    req.logout();
    //console.log(req.session);
    res.sendStatus(200);
});



var server = app.listen(config.get('server:port'), config.get('server:host'));




module.exports = server;

