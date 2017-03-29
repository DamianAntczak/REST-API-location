//models/image.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    name: String,
    db_name: String,
    mime_typ: String,
    created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Image',ImageSchema);