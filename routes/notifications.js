const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const FriendRequest = require('../models/friendRequest');
const Notification = require('../models/notification');


/*CREATING & DELETING & MANIPULATING*/

router.post('/notifications/create', auth, (req, res) => {
    if(req.userData.userId === req.body.receiverId || req.body.isDeleting === true || req.body.actionType === 'disliked'){
        res.sendStatus(200); //if the user is making action on his own object, no notification needs to be sent
    }
    else{
        const notification = new Notification({
            receiverId: req.body.receiverId, //get requests will search in this field
            senderId: req.userData.userId, //id of the user respobsible for the action
            senderNick: req.body.senderNick, //nickname of the user respobsible for the action
            objectType: req.body.objectType, //photo, comment or blog
            objectId: req.body.objectId, //id for link to object
            actionType: req.body.actionType, //liked or disliked or commented
            wasSeen: false
        });
    
        notification.save().then(notification => {
            res.sendStatus(201);
        });
    }
});


router.get('/notifications/delete/all', auth, (req, res) => {
    Notification.deleteMany({receiverId: req.userData.userId}).then(()=>{
        res.sendStatus(200);
    }).catch(err => console.log(err));
});

router.post('/notifications/delete/one', auth, (req, res) => {
    Notification.findByIdAndDelete(req.body.data.notificationId, (err, doc) => {
        res.sendStatus(200);
    });
});


router.get('/notifications/setSeen/:id', auth, (req, res) => {
    Notification.findByIdAndUpdate(req.params.id, {wasSeen: true}, {new: true}, (err, doc) => {
        if(err) console.log(err)
        else{
            res.json(doc);
        }
    })
})

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

router.get('/notifications', auth, (req, res) => {
    Notification.find({receiverId: req.userData.userId}).exec().then(notifications => {
        FriendRequest.find({friendId: req.userData.userId}).exec().then(requests => {
            let notifsReversed = notifications.reverse();
            const returnArray = requests.concat(notifsReversed);
            
            res.json({
                notifications: returnArray
            });
        })
        .catch(err => console.log(`error finding request: ${err}`));
    }).catch(err => console.log(err));
})

module.exports = router;