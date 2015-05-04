'use strict';

var request = require('supertest'),
    mongodb = require('mongodb'),
    server  = null;

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
    var agentA = null;

    it(" POST /api/tweets responds with status code 403 when posting tweets from unauthenticated user", function(done) {
        server = require('../index');
        var Session = require('supertest-session')({
            app: server
        });
        agentA = new Session()
        var tweet = { userId: 'aristodemo', text: 'Termopili'};
        agent
            .post('/api/tweets')
            .send({tweet: tweet })
            .expect(403, done);

    });

    it('POST /api/users creates and authenticates user "test"', function(done) {
        var testUser = { id: 'test', name: 'Test user', email: 'test@gmail.com', password: 'tester'};
        agentA
            .post('/api/users')
            .send({ user: user })
            .expect(200, done);
    });
});