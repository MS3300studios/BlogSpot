const express = require('express');
const router = express();

const { BlockedUser } = require('../models/blockedUsers');
const { BlockedUsers } = require('../models/blockedUsers');

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
        if(!doc){
            //the user doesn't have a block list yet, creating list:
            const BlockedUser = new BlockedUser({
                blockedUserId: req.body.userToBeBlockedId
            })

            const BlockedUsers = new BlockedUsers({
                forUser: req.userData.userId,
                blockedUsers: [BlockedUser]
            })

            BlockedUsers.save().then(response => {
                console.log(response);
                res.sendStatus(200);
            })
        }
        else{
            let list = doc.blockedUsers;
            const BlockedUser = new BlockedUser({
                blockedUserId: req.body.userToBeBlockedId
            });
            list.push(BlockedUser);
            doc.blockedUsers = list;
            doc.save().then(response => {
                console.log(response);
                res.sendStatus(200);
            })
        }
    })
})

router.post('/blocking/removeBlock', auth, (req, res) => {

})

module.exports = router;