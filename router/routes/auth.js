'use strict';

var express  = require('express'),
    conn     = require('../../db'),
    passport = require('../../auth'),
    router  =  express.Router();


router.post('/login', function(req, res) {
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

router.post('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
});

module.exports = router;