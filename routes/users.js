const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/user');
const auth = require('../middleware/authorization');

router.use(cors());
router.use(express.json({limit: '10mb'}));
router.use(express.urlencoded({limit: '10mb', extended: true}));


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
                photo: req.body.photoString,
                password: hash,
                debugpass: req.body.password
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
            });
        });
});

router.post('/users/login', (req, res) => {
    User.find({email: req.body.email})
        .exec()
        .then(users => {
            if(users.length < 1){
                return res.sendStatus(401); //didn't find any users
            }
            bcrypt.compare(req.body.password, users[0].password, (err, isEqual) => {
                if(err) return res.sendStatus(401);
                if(isEqual) {
                    const token = jwt.sign(
                        {
                            email: users[0].email,
                            userId: users[0]._id
                        },
                        process.env.SECRET,
                        {
                            expiresIn: "1h"
                        }
                    );
                    
                    users[0].photo = "get /users/getUserPhoto/:userId for photo";
                    let userDataJSON = JSON.stringify(users[0]);
                    console.log(userDataJSON)
                    return res.status(200).json({
                        message: 'Authorization successful',
                        token: token,
                        userData: userDataJSON
                    });
                    
                }

                res.sendStatus(401);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.get('/users/getUser/:userId', auth, (req, res) => {
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            res.json({
                user: user
            });
        })
        .catch(error => {
            console.log('get user error: ', error);
            res.sendStatus(500);
        })
})

router.get('/users/getUserPhoto/:userId', auth, (req, res) => {
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            if(user === null){
                res.send('error loading photo, incorrect user id');
            }
            res.json({
                photo: user.photo
            });
        })
        .catch(error => {
            console.log('get user error: ', error);
            res.sendStatus(500);
        })
})

router.post('/users/find', auth, (req, res) => {
    let search = {};
    switch (req.body.field) {
        case "nickname":
            search = {nickname: req.body.payload}
            break;
        case "name":
            search = {name: req.body.payload}
            break;
        case "surname":
            search = {surname: req.body.payload}
            break;
        case "id":
            search = {_id: req.body.payload}
            break;
        default:
            res.json({error: "incorrect request field"});
            break;
    }
    User.find(search)
        .exec()
        .then(users => {
            console.log(users)
            if(users.length<1){
                res.send("user not found");
            }
            else{
                res.status(200).json({users: users});
            }
        })
        .catch(err => res.status(404).json({message: "error finding user", error: err}))
})


router.post('/users/edit/all', auth, (req, res) => { //newdata, userid, userphoto
    if(
        req.body.name !== "" &&
        req.body.surname !== "" &&
        req.body.nickname !== "" &&
        req.body.bio !== "" &&
        req.body.photo !== "" 
    ){
        let update = {photo: req.body.photo}
        if(req.body.wasChanged.name === true) update.name = req.body.name
        if(req.body.wasChanged.surname === true) update.surname = req.body.surname
        if(req.body.wasChanged.nickname === true) update.nickname = req.body.nickname
        if(req.body.wasChanged.bio === true) update.bio = req.body.bio
    
        console.log(req.body.wasChanged)

        User.findByIdAndUpdate(req.userData.userId, update, {new: true}).then(user => {
            res.json({
                user: user
            })
        })
    }
    else{
        res.status(403)
    }

})

//router.post('/users/edit/bio', )

module.exports = router;