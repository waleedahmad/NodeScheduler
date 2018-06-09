let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostSchema = new Schema({
    user_id : String,
    message : String,
    media : String,
    schedule_time : String,
    page_id : String,
    page_name : String,
    published : Boolean,
    type_of : String,
    publish_id : String
});

module.exports = PostSchema;