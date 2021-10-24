const express = require('express');
const router = express();

const User = require('../models/user');
const bannedUser = require('../models/bannedList');

router.use(express.json());

router.get('/bannedUsers', function(req, res){
    bannedUser.find().exec().then(users => res.json(users));
})

router.post('/banUser', function(req, res){ 
    if(req.body.password === "admin3300" && req.body.userID.length === 24){
        User.findById(req.body.userID, (err, doc)=>{
            if(err) console.log(err)
            else if(doc !== null){
                const ban = bannedUser({bannedUserId: req.body.userID});
                ban.save().then(()=> res.sendStatus(201))
            }
            else{
                res.json({error: "user does not exist"})
            }
        })
    }
    else{
        res.json("invalid request parameters")
    }
})

router.post('/removeBan', function(req, res){
    bannedUser.deleteMany({bannedUserId: req.body.id}).then(() => res.sendStatus(200));
})

module.exports = router;