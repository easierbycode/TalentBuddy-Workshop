var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var tweetSchema = new Schema({
    userId  : { type: String },
    created : { type: Number },
    text    : { type: String }
});

// assign a function to the "methods" object of our twitterlSchema

tweetSchema.methods.toClient = function() {
    var tweet = this.toObject();
    tweet.id = tweet._id;
    delete tweet._id;
    delete tweet.__v;
    return tweet;
};

module.exports = tweetSchema;