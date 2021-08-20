const express = require('express');
const router = express();

const blockedUsersModule = require('../models/blockedUsers');
const OneBlockedUser = blockedUsersModule.BlockedUser;
const BlockedUsers = blockedUsersModule.BlockedUsers;

const auth = require('../middleware/authorization');

router.use(express.json());

router.get('/blocking/blockedUsers', auth, (req, res) => {
    BlockedUsers.findById(req.userData.userId, (err, doc) => {
        console.log(doc)
    })
})

router.get('/blocking/checkBlock/:userToBeChecked', auth, (req, res) => {
    //checking if user's blockedUsersList contains ID given in params
    
    //req.userData.userId
    //req.params.userToBeChecked
})

router.post('/blocking/addBlock', auth, (req, res) => {
    BlockedUsers.findOne({forUser: req.userData.userId}, (err, doc) => {
        console.log(doc)
    })
})

router.post('/blocking/removeBlock', auth, (req, res) => {

})

module.exports = router;