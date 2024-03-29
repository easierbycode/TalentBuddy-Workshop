'use strict';

var fs = require('fs');

describe("Simple tests", function() {
    it('check if dummy file exists', function(done) {
        fs.exists('dummy', function(exists) {
            if (exists) {
                return done(null);
            } else {
                done(new Error('File doesn\'t exist'));
            }
        });
    });
});