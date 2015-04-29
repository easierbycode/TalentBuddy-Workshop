'use strict';

var request = require('supertest'),
    mongodb = require('mongodb');

process.env.NODE_ENV = 'test';

describe("Test suite POST /api/tweets", function() {

    before(function(done) {
        var dbClient = mongodb.MongoClient,
            url      = 'mongodb://127.0.0.1:27017/twittertest';
        dbClient.connect(url, function(err, connessione) {
            if (err) {
                var msg = 'Could not connect to database';
                console.log(err);
                return done(new Error(msg));
            } else {
                connessione.dropDatabase(function(err, result) {
                    if (err) {
                        var msg = 'Oooopsss..... trying to drop failed';
                        console.log(err);
                        return done(new Error(msg));
                    }
                    done(null, connessione);
                });
            }
        });
    });

    it("test case schenario 1", function(done) {
        done();
    });

    it("test case scenario 2", function(done) {
        done();
    });
});