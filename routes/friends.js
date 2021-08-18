const express = require('express');
const router = express();

const User = require('../models/user');
const Friend = require('../models/friend');
const FriendRequest = require('../models/friendRequest');
const auth = require('../middleware/authorization');

router.use(express.json());


//creating request
router.post('/createRequest', auth, (req, res) => {
    //check if the request already exists
    FriendRequest.findOne({userId: req.userData.userId, friendId: req.body.friendId}).exec().then(friend => {
        if(friend){
            res.status(401);
        }
        else{
            FriendRequest.findOne({userId: req.body.friendId, friendId: req.userData.userId}).exec().then(friend2 => {
                if(friend2){
                    res.status(401);
                }
                else{
                    User.findOne({_id: req.body.friendId})
                    .exec()
                    .then(friend => {
                        //creating request 
                        const friendRequest = new FriendRequest({
                            userId: req.userData.userId,
                            friendId: friend._id
                        });
                        
                        friendRequest.save()
                            .then(response => {
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
                }
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            error: err
        })
    });
    
});

router.post('/revokeRequest', auth, (req, res) => {
    FriendRequest.findOneAndDelete({userId: req.userData.userId, friendId: req.body.friendId}).exec()
        .then(response => {
            res.send('deletion successful');
        })
        .catch(err => console.log(err));
})

router.post('/revokeRequestById', auth, (req, res) => {
    FriendRequest.findByIdAndDelete(req.body.friendReqId).exec()
        .then(response => {
            res.send('deletion successful');
        })
        .catch(err => console.log(err)); 
})

//managing request (decline or accept)
router.post('/anwserRequest', auth, (req, res) => {
    if(req.body.accept === true){
        //delete request, add friend
        FriendRequest.findOneAndRemove({userId: req.body.friendId, friendId: req.userData.userId}).exec().then((response)=>{
            if(response){ //if there was such a request
                const friend = new Friend({
                    userId: req.userData.userId,
                    friendId: req.body.friendId
                });
                friend.save()
                    .then(response => {
                        console.log("friend added");
                        res.sendStatus(201);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
            }
            else{
                res.status(500);
            }
        })
    }
    else if(req.body.accept === false){
        //delete request
        FriendRequest.findOneAndRemove({friendId: req.body.friendId})
        .exec()
        .then(response => {
            res.sendStatus(200);
        })
        .catch(err => {
            return res.status(500)
        });
    }
    else{
        res.status(500);
    }
});


//delete friends 

router.post('/deleteFriend', auth, (req, res) => {
    Friend.findOneAndDelete({userId: req.userData.userId, friendId: req.body.friendId})
        .exec()
        .then(response => {
            if(response){
                res.status(200);
            }
            else{
                res.status(404);
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500)
        });
});

router.post('/checkFriendStatus', auth, (req, res) => {
    Friend.exists({userId: req.userData.userId, friendId: req.body.friendId}, (err, exists) => {
        Friend.exists({userId: req.body.friendId, friendId: req.userData.userId}, (err, exists2) => {
            let reply = exists || exists2;
            res.json({
                isFriend: reply
            });
        })
    })

})

router.post('/checkFriendRequest', auth, (req, res) => {
    /*
        first we check if the user has sent any requests: where he is the sender (userId)
        and then we check if the user has received any requests: where he is the friend (friendId) that someone wants to have
    */
    FriendRequest.exists({userId: req.userData.userId, friendId: req.body.friendId}, (err, exists) => {
        FriendRequest.exists({userId: req.body.friendId, friendId: req.userData.userId}, (err2, exists2) => {
            res.json({
                iSendRequest: exists,
                iReceivedRequest: exists2
            });
        })
    })
})


router.get('/friends/all/:id', auth, (req, res) => {
    Friend.find({userId: req.userData.userId})
        .exec()
        .then(friends => {
            Friend.find({friendId: req.userData.userId})
            .exec()
            .then(friends2 => {
                let allFriends = friends.concat(friends2);
                let friendsData = allFriends.map((object, index) => {
                    if(object.userId === req.userData.userId){
                        return (
                            {
                                _id: object._id,
                                userId: object.userId,
                                friendId: object.friendId,
                                createdAt: object.createdAt,
                                updatedAt: object.updatedAt
                            }
                        )
                    }
                    else if(object.friendId === req.userData.userId){
                        return (
                            {
                                _id: object._id,
                                userId: object.friendId,
                                friendId: object.userId,
                                createdAt: object.createdAt,
                                updatedAt: object.updatedAt
                            }
                        )
                    }
                })

                function getter(id){
                    return new Promise((resolve, reject) => {
                        User.findById(id)
                            .exec()
                            .then(user => {
                                resolve(user);
                            }) 
                            .catch(error => {
                                reject(error.code);
                            })
                    })
                }

                let fullFriendsArr = [];

                async function looper(){
                    for(let i=0; i<friendsData.length; i++){
                        let fullFriend = await getter(friendsData[i].friendId);
                        fullFriendsArr.push(fullFriend)
                    }
                    res.status(200).json({
                        friends: fullFriendsArr
                    }) 
                }


                looper();
            })
            .catch(err => {
                console.log(err);
                res.status(500);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        })
})


module.exports = router;