var express = require('express');
var router = express.Router();
var Point = require('../models/point');
var Image = require('../models/image');
var Category = require('../models/category');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var im = require('imagemagick');
var path = require('path');

/* GET users listing. */
//noinspection JSUnresolvedFunction,JSUnresolvedFunction
router.get('/', function(req, res, next) {
    var query = Point.find({}).populate({
        path: 'category',
        select: 'name'
        })
        .populate({
        path: 'images',
        select: 'db_name',
        options: { limit: 1}
    });
    query.exec(function(err,points){
        if(err)
            res.send(err);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(points,['_id','name','location', 'created_at','images', 'db_name','category']));
    });
});

router.get('/:id', function(req, res, next) {
    var query = Point.findById(req.params.id).populate('images').populate('category');
    query.exec(function(err,point){
        if(err)
            res.send(err);

        res.json(point);
    });
});

router.get('/closest/:lat,:lng/:dist',function(req,res){
    var query = Point.find({ location : { $near : [req.params.lat, req.params.lng], $maxDistance : req.params.dist/111.12} });
    query.exec(function(err,points){
        if(err)
            res.send(err);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(points,['_id','name','location', 'created_at']));
    });
});

router.post('/', function (req, res) {
    var point = new Point();
    point.name = req.body.name;
    point.location = [ req.body.lat, req.body.lng];
    point.description = req.body.description;
    point.category = req.body.category;

    point.save(function(err,p){
        if(err)
            res.send(err);

        res.json({message: 'Point created!',_id:p._id});
    });
});

router.post('/:id/image',function (req, res) {
    var form = new formidable.IncomingForm();
    var fileName = 'img'+crypto.randomBytes(12).toString('hex');

    form.multiples = true;

    form.uploadDir = path.join(__dirname, '../public/images/fullsize');

    form.on('file', function(field, file) {
        fileName += path.extname(file.name);
        fs.rename(file.path, path.join(form.uploadDir, fileName));

        im.resize({
            srcPath: path.join(__dirname, '../public/images/fullsize/' + fileName ),
            dstPath: path.join(__dirname, '../public/images/thumbs/' + fileName ),
            width: 200
        }, function(err, stdout, stderr){
            if (err) throw err;
        });

        console.log(file.type);

        var query = Point.findById(req.params.id);
        query.exec(function(err,point){
            if(err)
                res.send(err);
            var image = new Image();
            image.name = file.name;
            image.db_name = fileName;
            image.mime_typ = file.type;
            image.save(function () {
                console.log('ok');
            });

            point.images.push(image);
            point.save(function (err, img) {
                if(err)
                    res.send(err);
                res.json({succes: 'true', filename: fileName,db_name: img.db_name});
            });
        });
    });

    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // form.on('end', function() {
    //     res.json({succes: 'true', filename: fileName});
    // });

    form.parse(req);
});

router.put('/:id',function (req,res) {
    Point.findById(req.params.id, function (err, point) {
        if(err){
            console.log(err);
            res.status(500).send();
        }else {
            if(!point){
                res.status(404).send();
            }
            else {
                point.updated_at = Date.now();
                point.name = req.body.name;
                point.description = req.body.description;

                if (!(isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng)))) {
                    point.location = [req.body.lat, req.body.lng];
                }

                point.location = req.body.location;
                point.category = req.body.category;

                point.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json(point);
                });
            }

        }
    });
});

router.delete('/:id',function (req, res) {
    Point.findByIdAndRemove(req.params.id, function (err) {
        if(err)
            res.send(err);

        res.json({ message: 'Point removed'});
    })
})

module.exports = router;
