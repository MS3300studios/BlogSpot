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
    FriendRequest.findOne({friendId: req.body.friendId}).exec().then(friend => {
        if(friend){
            console.log('this request already exists')
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
            console.log('deleting friend request response:', response);
            res.send('deletion successful');
        })
        .catch(err => console.log(err));
})

//managing request (decline or accept)
router.post('/anwserRequest', auth, (req, res) => {
    if(req.body.accept === true){
        //delete request, add friend
        FriendRequest.findOneAndRemove({friendId: req.body.friendId}).exec().then((response)=>{
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
                console.log("friend request doesn't exist");
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
        console.log('request data error');
        res.status(500);
    }
});


//delete friends 

// router.post('/deleteFriend', auth, (req, res) => {
//     Friend.findOneAndDelete({friendId: req.body.friendId})
//         .exec()
//         .then(response => {
//             if(response){
//                 console.log('user deleted successfully');
//                 res.status(200);
//             }
//             else{
//                 console.log('friend deletion failed, friend was not found');
//                 res.status(404);
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             return res.status(500)
//         });
// });

router.post('/getFriends', auth, (req, res) => {
    Friend.find({userId: req.userData.userId})
        .exec()
        .then(friends => {
            return res.status(200).json({
                friends: friends
            }) 
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        })
})

router.post('/checkFriendStatus', auth, (req, res) => {
    Friend.exists({userId: req.userData.userId, friendId: req.body.friendId}, (err, exists) => {
        res.json({
            isFriend: exists
        });
    })

})

router.post('/checkFriendRequest', auth, (req, res) => {
    FriendRequest.exists({userId: req.userData.userId, friendId: req.body.friendId}, (err, exists) => {
        res.json({
            requestExists: exists
        });
    })
})

module.exports = router;