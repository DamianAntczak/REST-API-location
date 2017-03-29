//models/opinion.js

var mongoose = require('mongoose');
var Point = require('./point');
var User = require('./user');
var Schema = mongoose.Schema;

var OpinionSchema = new Schema({
    rate: Number,
    point: { type : mongoose.Schema.ObjectId, ref : 'Point' },
    user: { type : mongoose.Schema.ObjectId, ref : 'User' }
});

module.exports = mongoose.model('Opinion',OpinionSchema);