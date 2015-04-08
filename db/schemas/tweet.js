var _        = require('lodash'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var tweetSchema = new Schema({
    userId  : { type: String },
    created : { type: Number },
    text    : { type: String }
});

// assign a function to the "methods" object of our twitterlSchema

tweetSchema.methods.toClient = function() {

    var tweet = _.pick(this, ['userId', 'created', 'text']);
    tweet.id = this._id;

    return tweet;
};

module.exports = tweetSchema;