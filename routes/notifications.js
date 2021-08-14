const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const FriendRequest = require('../models/friendRequest');
const Notification = require('../models/notification');


/*CREATING & DELETING*/

router.post('/notifications/create', auth, (req, res) => {
    if((req.userData.userId === req.body.receiverId) || (req.body.isDeleting === true)){
        res.sendStatus(200); //if the user is making action on his own object, no notification needs to be sent
    }
    else{
        const notification = new Notification({
            receiverId: req.body.receiverId, //get requests will search in this field
            senderId: req.userData.userId, //id of the user respobsible for the action
            senderNick: req.body.senderNick, //nickname of the user respobsible for the action
            objectType: req.body.objectType, //photo, comment or blog
            objectId: req.body.objectId, //id for link to object
            actionType: req.body.actionType //liked or disliked or commented
        });
    
        notification.save().then(notification => {
            console.log(notification);
            res.sendStatus(201);
        });
    }
});


/*CHECKING*/

//check friend requests for the logged in user
router.get('/notifications/getFriendRequests', auth, (req, res) => {
    FriendRequest.find({friendId: req.userData.userId}).exec().then(requests => {
        res.json({
            requests: requests
        })
    })
    .catch(err => console.log(`error finding request: ${err}`));
})

//check mentions

//check likes 
router.get('/notifications/:userId', auth, (req, res) => {
    Notifications.find({receiverId: req.userData.userId}).exec().then(notifications => {
        res.json({
            notifications: notifications
        })
    }).catch(err => console.log(err));
})

//check comments 

module.exports = router;