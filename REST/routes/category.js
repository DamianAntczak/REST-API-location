var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var jwt  = require('jsonwebtoken');
var app = require('../app');


router.get('/', function(req, res, next) {
    var query = Category.find({});
    query.exec(function(err,points){
        if(err)
            res.send(err);

        res.json(points);
    });
});

router.post('/',function (req,res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify( token, String(app.secret), function(err) {
            if(err){
                res.json({message: 'Failed token'});
            }
            else {
                var category = new Category();
                category.name = req.body.name;

                category.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: 'Category created!'});
                });
            }
        });
    }
    else{
        return res.status(403).send({
            success: false,
            message: 'No token find.'
        });
    }

});


router.delete('/:id',function (req,res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    console.log(token);

    if(token) {
        jwt.verify( token, String(app.secret), function(err) {
            if(err){
                res.json({message: 'Failed token'});
            }
            else {
                Category.findByIdAndRemove(req.params.id, function (err) {
                    if(err)
                        res.send(err);

                    res.json({message: 'Point removed!'});
                });
            }
        });
    }
    else{
        return res.status(403).send({
            success: false,
            message: 'No token find.'
        });
    }

});



module.exports = router;