//models/point.js

var mongoose = require('mongoose');
var Category = require('./category');
var Image = require('./image');
var Schema = mongoose.Schema;

var PointSchema = new Schema({
    name: String,
    location: {
        type: [Number],
        index: '2d'
    },
    description: String,
    category: { type : mongoose.Schema.ObjectId, ref : 'Category' },
    images: [{ type : mongoose.Schema.ObjectId, ref : 'Image' }],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Point',PointSchema);