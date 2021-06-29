const express = require('express');
const router = express();

// const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
const auth = require('../middleware/authorization');

//check friend requests for the logged in user
router.post('/notifications/getFriendRequests', auth, (req, res) => {
    FriendRequest.find({friendId: req.userData.userId}).exec().then(requests => {
        res.json({
            requests: requests
        })
    })
    .catch(err => console.log(`error finding request: ${err}`));
})

//check mentions

//check likes 

//check anwsers 

module.exports = router;