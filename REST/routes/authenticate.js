var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var User = require('../models/user');
var jwt  = require('jsonwebtoken');
var app = require('../app');

router.post('/', function (req, res) {

    var query = User.findOne({
        name: req.body.name
    });

    query.exec(function (err, user) {
        if(err)
            res.send(err);

        if(!user){
            res.send({success: false, message: 'Authentication failed! User not exist or wrong password'});
        }
        else{
            if(bcrypt.compareSync(req.body.password, user.password)){


                var token = jwt.sign(user, String(app.secret)); //expires in 1h
                console.log(String(app.secret));

                res.send({
                    success: true,
                    message: 'Your token',
                    token: token,
                    user: {
                        name: user.name,
                        mail: user.mail
                    }
                })

            }
            else{
                res.send({
                    success: false,
                    message: 'Authentication failed! User not exist or wrong password'
                })
            }
        }
    });
});

module.exports = router;
