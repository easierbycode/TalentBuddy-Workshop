var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var tweetSchema = new Schema({
    userId  : { type: String },
    created : { type: Number },
    text    : { type: String }
});

module.exports = tweetSchema;