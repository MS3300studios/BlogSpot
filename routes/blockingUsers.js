const express = require('express');
const router = express();

const { BlockedUser } = require('../models/blockedUsers');
const { BlockedUsers } = require('../models/blockedUsers');
const User = require('../models/user');

const auth = require('../middleware/authorization');

router.use(express.json());

router.post('/blocking/blockedUsers', auth, (req, res) => {
    BlockedUsers.findOne({forUser: req.userData.userId}).exec().then(blockedUsers => {

        if(req.body.getFullData === false){
            res.json({
                users: blockedUsers
            })
        }
        else if(req.body.getFullData === true){

            if(blockedUsers === null){
                res.json({
                    users: []
                });
            }
            else{
                let friendsData = blockedUsers.blockedUsers;

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
                        let fullFriend = await getter(friendsData[i].blockedUserId);
                        fullFriendsArr.push(fullFriend)
                    }

                    res.status(200).json({
                        users: fullFriendsArr
                    }) 
                }


                looper();
            }
        }
    }).catch(err => console.log(err))
})

router.get('/blocking/checkBlock/:userToCheck', auth, (req, res) => {
    BlockedUsers.findOne({forUser: req.userData.userId}, (err, blockList) => {
        if(!blockList) res.json({blocked: false});
        else{
            let isInList = blockList.blockedUsers.filter(el => {
                if(el.blockedUserId === req.params.userToCheck) return true
                else return false
            })
            
            if(isInList.length === 0){
                res.json({blocked: false});
            }
            else{
                res.json({blocked: true});
            }
        }
    })
})

router.post('/blocking/addBlock', auth, (req, res) => {
    BlockedUsers.findOne({forUser: req.userData.userId}, (err, doc) => {
        if(!doc){
            //the user doesn't have a block list yet, creating list:
            const blockedUser = new BlockedUser({
                blockedUserId: req.body.userToBeBlockedId
            })

            const blockedUsers = new BlockedUsers({
                forUser: req.userData.userId,
                blockedUsers: [blockedUser]
            })

            blockedUsers.save().then(response => {
                res.sendStatus(200);
            })
        }
        else{
            let list = doc.blockedUsers;
            // checking if user's blocklist includes the user to be blocked
            let isInList = list.filter(el => {
                if(el.blockedUserId === req.body.userToBeBlockedId) return true
                else return false
            })

            //user is not in blocked list, so server is adding him to it 
            if(isInList.length === 0){
                const blockedUser = new BlockedUser({
                    blockedUserId: req.body.userToBeBlockedId
                });
                list.push(blockedUser);
                doc.blockedUsers = list;
                doc.save().then(response => {
                    res.sendStatus(200);
                })
            }
            else{
                res.send("user is already blocked");
            }

        }
    })
})

router.post('/blocking/removeBlock', auth, (req, res) => {
    BlockedUsers.findOne({forUser: req.userData.userId}, (err, doc) => {
        if(!doc){
            //the user doesn't have a blockList res.404
            res.json({err: 'user does not have a block list'});
        }
        else{
            let filteredList = doc.blockedUsers.filter(el => {
                if(el.blockedUserId === req.body.blockedUserId) return false
                else return true
            });

            doc.blockedUsers = filteredList;
            doc.save().then(()=>{
                res.sendStatus(200);
            })
        }
    })
})

module.exports = router;