//models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    password: String,
    mail: String,
    group: [ String ]
});

module.exports = mongoose.model('User', UserSchema);