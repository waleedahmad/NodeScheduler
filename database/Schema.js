let mongoose = require('mongoose');

exports.User = mongoose.model('User', require('./UserSchema'));
exports.Post = mongoose.model('Post', require('./PostSchema'));