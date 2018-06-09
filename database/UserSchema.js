let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: String,
    email : String,
    facebookID : String,
    accessToken : String,
});

module.exports = UserSchema;