var express = require('express');
var router = express.Router();
var Trail = require('../models/trail');

/* GET users listing. */
router.get('/',function(req, res){
    var query = Trail.find({}).populate('points');
    query.exec(function(err,trails){
        if(err)
            res.send(err);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(trails,['_id','name', 'location','created_at']));
    });
});

router.get('/:id',function (req,res) {
    var query = Trail.findById(req.params.id).populate({
        path: 'points',
        populate: {path: 'images'}
    });
    query.exec(function (err, trail) {
        if(err)
            res.send(err);
        res.json(trail);
    });
});

router.post('/',function (req,res) {
    var trail = new Trail();
    trail.name = req.body.name;
    trail.description = req.body.description;

    trail.save(function (err) {
        if(err)
            res.send(err);
        res.json(trail);
    });
});

router.post('/:id/point',function (req,res) {
    Trail.findById(req.params.id,function (err, trail) {
        if(err) {
            console.log(err);
            res.status(500).send();
        }
        else{
            if(!trail){
                res.status(404).send();
            }
            else{
                trail.updated_at = Date.now();
                trail.points.push({_id:req.body.point});

                trail.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json(trail);
                });
            }
        }
    });
});



router.put('/:id',function (req,res) {
    Trail.findById(req.params.id, function (err, trail) {
        if(err){
            console.log(err);
            res.status(500).send();
        }
        else{
            trail.updated_at = Date.now();
            trail.points = req.body.points;
        }
    });
});

router.delete('/:id',function (req,res) {
    Trail.findByIdAndRemove(req.params.id,function (err) {
        if(err){
            console.log(err);
            router.status(500).send();
        }
        else{
            res.json({success:true,message:'Trail was removed'});
        }

    })
});

module.exports = router;
