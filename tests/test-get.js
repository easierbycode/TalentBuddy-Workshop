'use strict';

var request = require('supertest');
var server = null;

before(function(done) {
    process.env.NODE_ENV = "test";
    done();
});

describe('test GET request to /api/tweets', function(done) {
    it('respond with status code 404 for requests GET /api/tweets/55231d90f4d19b49441c9cb9', function(done) {
        server = require('../index');
        request(server)
            .get('/api/tweets/55231d90f4d19b49441c9cb9')
            .expect(404,  done);
    });
});
