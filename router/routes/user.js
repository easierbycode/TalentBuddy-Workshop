

var _        = require('lodash'),
    express  = require('express'),
    conn     = require('../../db'),
    router  =  express.Router();

var ensureAuthentication = require('../../middleware/ensureAuthentication');


router.get('/:userId', function(req, res) {
    var userId = req.params.userId,
        User   = conn.model('User');

    User.findOne({id: userId}, function(err, user) {
        if (!user) {
            return res.sendStatus(404);
        }
        res.status(200).json({ user: user.toClient() });
    });
});

router.post('/:userId/follow', ensureAuthentication(), function(req, res) {
    //I'll change this
    var userId = req.params.userId;
    var User   = conn.model('User');
    if (!userId) {
        return res.sendStatus(403);
    }
    User.findOne({ id: userId}, function(err, user) {
        if (err) {
            return res.sendStatus(500);
        }
        if(!user) {
            return res.sendStatus(403);
        } else {
            User.findOneAndUpdate({ id : req.user.id }, { $addToSet: { followingIds: userId }  }, function(err, user) {
                if (err) {
                    return err;
                }
                return res.sendStatus(200);
            });
        }
    });
});

router.post('/:userId/unfollow', ensureAuthentication(), function(req, res) {
    //I'll change this
    var userId = req.params.userId;
    var User   = conn.model('User');
    if (!userId) {
        return res.sendStatus(403);
    }
    User.findOne({ id: userId}, function(err, user) {
        if (err) {
            return res.sendStatus(500);
        }
        if(!user) {
            return res.sendStatus(403);
        } else {
            User.findOneAndUpdate({ id : req.user.id }, { $pull: { followingIds: userId }  }, function(err) {
                if (err) {
                    return err;
                }
                return res.sendStatus(200);
            });
        }
    });
});

router.put('/:userId', ensureAuthentication(), function(req, res) {
    var User   = conn.model('User');
    if (req.user.id !== req.params.userId) {
        return res.sendStatus(403);
    }
    User.findOneAndUpdate({ id: req.params.userId }, { password: req.body.password }, function(err, user) {
        console.log(user);
        return res.sendStatus(200);
    });
});

router.post('/', function(req, res)  {
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
            console.log(newUser);
        });
    });

});

router.get('/:userId/friends', function(req, res) {
    var User = conn.model('User');
    User.findOne({ id: req.params.userId }, function(err, user) {
        if(!user) {
            return res.sendStatus(404);
        }
        var followUserId = user.followingIds;
        User.find({
            'id' : { $in: followUserId }
        }, function(err, users) {
            return res.json({ users: users.map(function(user) {
                return user.toClient();
            })});
        });
    });
});

router.get('/:userId/followers', function(req, res) {
    var User = conn.model('User');
    User.find({ followingIds: req.params.userId }, function(err, users){
        if(_.isEmpty(users)) {
            return res.sendStatus(404);
        }
        res.json({ users: users.map(function(follower) {
            return follower.toClient();
        })});
    });
});

module.exports = router;