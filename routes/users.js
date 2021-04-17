const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../secret.json');
const cors = require('cors');
const User = require('../models/user');

router.use(cors());
router.use(express.json({limit: '10mb'}))
router.use(express.urlencoded({limit: '10mb'}))


router.post('/users/register', (req, res) => {
    bcrypt.hash(req.body.password, 10, function(err, hash){
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        else{
            const user = new User({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                nickname: req.body.nickname,
                password: hash
            });

            user.save()
                .then(result => {
                    res.sendStatus(201);
                })
                .catch(err => res.json({error: err}));
        }
    })
})

router.delete('/users/delete/:userId', (req, res) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(response => {
            res.status(200).json({
                message: 'user deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post('/users/login', (req, res) => {
    User.find({email: req.body.email})
        .exec()
        .then(users => {
            if(users.length < 1){
                return res.sendStatus(401);
            }
            bcrypt.compare(req.body.password, users[0].password, (err, isEqual) => {
                if(err) return res.sendStatus(401);
                if(isEqual) {
                    const token = jwt.sign(
                        {
                            email: users[0].email,
                            userId: users[0]._id
                        },
                        secret.key,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: 'Authorization successful',
                        token: token
                    });
                    
                }

                res.sendStatus(401);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


module.exports = router;