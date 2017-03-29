var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user');
var jwt  = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var app = require('../app');

router.post('/', function (req, res) {


    var pass = req.body.password;

    if(req.body.name === undefined || req.body.password === undefined){
        res.send({success: false});
    }
    else if(req.body.password.length < 7) {
        res.send({success: false});
    }
    else{
            var salt = bcrypt.genSaltSync(12);
            var hash = bcrypt.hashSync(req.body.password, salt);
            var newUser = new User();
            newUser.name = req.body.name;
            newUser.mail = req.body.mail;
            newUser.group = req.body.group;
            newUser.password = hash;

            newUser.save(function(err){
                if(err)
                    res.send(err);

                res.send({success: true, message: 'User created!'});
        });

    }

});

module.exports = router;
