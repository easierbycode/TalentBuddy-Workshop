

var express  = require('express'),
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
        res.status(200).json({ user: user});
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

module.exports = router;