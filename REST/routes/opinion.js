var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();
var Opinion = require('../models/opinion');
var Point = require('../models/point');
var User = require('../models/user');

/* GET users listing. */
router.get('/point/:point',function(req, res){
    var query = Opinion.aggregate([
        { "$match": {
            point: new ObjectId(req.params.point)
        }},
        {
            "$group": {_id: "$point",
                average: {$avg: "$rate"},
                sum: {$sum: 1}
            }
        }
    ],function(err,result){
        if(err)
            res.send(err);

        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});


router.post('/point/:point/user/:user/:rate',function (req,res) {
    var opinion = new Opinion();
    var rate = req.params.rate;

    if(rate > 0 && rate<=5) {
        opinion.rate = rate;
        console.log('Rate');
        Point.findById(req.params.point, function (err, point) {
            console.log('Point');
            if (err)
                res.send(err);
            if (!point) {
                res.status(404).send();
            }
            else {
                opinion.point = point._id;
                User.findById(req.params.user,function (err, user) {
                    console.log('User');
                    if(err)
                        res.send(err);
                    if(!user){
                        res.status(404).send();
                    }
                    else {
                        opinion.user = user._id;
                        opinion.save(function (err) {
                            if(err)
                                res.send(err);
                            res.json(opinion);
                        });
                    }

                });
            }
        });

    }
    else{
        res.json({success: false, message: 'Rate between 1 and 5'});
    }

});


module.exports = router;

