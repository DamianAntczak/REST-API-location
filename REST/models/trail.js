//models/trail.js

var mongoose = require('mongoose');
var Point = require('./point');
var Schema = mongoose.Schema;

var TrailSchema = new Schema({
    name: String,
    description: String,
    points: [{ type : mongoose.Schema.ObjectId, ref : 'Point' }]
});

module.exports = mongoose.model('Trail',TrailSchema);