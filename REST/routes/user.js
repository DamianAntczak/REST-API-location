var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {

    var query = User.find({});
    query.exec(function (err,users) {
        if(err)
            res.send(err);
        res.json(users);
    })

});

router.get('/:id',function (req,res,next) {

    var query = User.find({_id: req.params.id});
    query.exec(function (err, user) {
        if(err)
            res.send(err);
        res.json(user);
    })
});

router.post('/', function (req, res) {

    var user = new User();
    user.name = req.body.name;
    user.password = req.body.password;
    user.group = req.body.group;

    user.save(function (err) {
        if(err)
            res.send(err);
        res.json({ success: true });
    })
});

module.exports = router;
