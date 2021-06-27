const express = require('express');
const router = express();

const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
const auth = require('../middleware/authorization');

router.use(express.json());

//creating request

router.post('/createRequest', auth, (req, res) => {
    User.findOne({_id: req.body.friendId})
        .exec()
        .then(friend => {
            //creating request instance
            const friendRequest = new FriendRequest({
                userId: req.userData.userId,
                friendId: friend._id
            });
            
            friendRequest.save()
                .then(response => {
                    console.log("friend request added");
                    res.sendStatus(201);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'user not found',
                error: err
            })
        });
});

//managing request (decline or accept)

router.post('/anwserRequest', auth, (req, res) => {
    if(req.body.accept === true){
        //delete request, add friend
    }
    else if(req.body.accept === false){
        //delete request
        FriendRequest.findOneAndRemove({friendId: req.body.friendId})
        .exec()
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            return res.status(500)
        });
    }
    else{
        console.log('request data error');
        res.status(500);
    }
});

module.exports = router;