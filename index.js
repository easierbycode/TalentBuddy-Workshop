

var express      = require('express'),
    config       = require('./config'),
    session      = require('express-session'),
    fixtures     = require('./fixtures'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
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
    var Tweet = conn.model('Tweet');
    if(!req.query.userId) {
        return res.sendStatus(400);
    }
    Tweet.find({ userId: req.query.userId}, null, {sort: { created: -1 } }, function(err, tweets) {
        if (err) {
            return res.sendStatus(500);
        }
        res.json({ tweets: tweets.map(function(tweet) {
          return tweet.toClient();
        })});
    });
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

});


app.post('/api/tweets', ensureAuthentication(), function(req, res) {
    var Tweet = conn.model('Tweet');
    var newTweet = new Tweet({
        text: req.body.tweet.text,
        created : Date.now() / 1000 | 0,
        userId : req.user.id
    });
    newTweet.save(function(err, newTweet) {
        if (err) {
            return res.status(500).json('Error occurred');
        }
        res.json({tweet: newTweet.toClient()});
    });

});

app.get('/api/tweets/:tweetId', function(req, res) {
    var Tweet = conn.model('Tweet');
    var searchTweet =  req.params.tweetId;

    Tweet.findById(searchTweet, function(err, tweet) {
        if (err) {
            return res.status(500).json({error: 'Error occurred'});
        }
        if(!tweet) {
            return res.sendStatus(404);
        }
        res.json({ tweet: tweet.toClient()});
    });

});



app.delete('/api/tweets/:tweetId', ensureAuthentication(), function(req, res) {
  var Tweet = conn.model('Tweet');
  Tweet.findByIdAndRemove(req.params.tweetId, function(err, tweet) {
    if(!(req.user.id !== tweet.userId)) {
      return res.sendStatus(403);
    }
    if(tweet.length === 0) {
      return res.sendStatus(404);
    }
    return res.sendStatus(200);
  });
  /*var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);
  if(pendtweet.length === 0) {
      return res.sendStatus(404);
  }
  if(pendtweet.userId === req.user.id) {
      _.remove(fixtures.tweets, 'id', pendtweet.id);
      return res.sendStatus(200);
  }
  return res.sendStatus(403);
  */
});

app.post('/api/auth/login', function(req, res) {
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
    res.sendStatus(200);
});



var server = app.listen(config.get('server:port'), config.get('server:host'));




module.exports = server;
