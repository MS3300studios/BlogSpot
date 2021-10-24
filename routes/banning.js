const express = require('express');
const router = express();

const User = require('../models/user');

router.use(express.json());

router.post('/banUser', function(req, res){
    if(req.body.password === "admin3300" && req.body.userID.length === 24){
        User.findById(req.body.userID, (err, doc)=>{
            if(err) console.log(err)
            else if(doc !== null){
                //user exists
                console.log('user exists')
            }
            else{
                console.log("user does not exist")
                res.json({error: "user does not exist"})
            }
        })
    }
    else{
        console.log("invalid request parameters")
        res.json("invalid request parameters")
    }
})

module.exports = router;