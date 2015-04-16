var _           = require('lodash'),
    mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    bcrypt      = require('bcrypt'),
    SALT_FACTOR = 10;

var userSchema = new Schema({
    id: { type: String, unique: true },
    name: String,
    email: {type: String, unique: true},
    password: String,
    followingIds: { type: [String], default: [] }
});

userSchema.methods.comparePassword = function(ricerca, done) {
    bcrypt.compare(ricerca, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

userSchema.methods.toClient = function() {
    var user = _.pick(this, ['id', 'name']);
    return user;
};

userSchema.pre('save', function(next) {
    var user = this;
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hashedPassword) {
            if (err) {
                return next(err);
            }
            user.password = hashedPassword;
            next();
        });
    });
});


module.exports = userSchema;
