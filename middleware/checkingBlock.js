//to be called AFTER authorization middleware
const { BlockedUsers } = require('../models/blockedUsers');

module.exports = (req, res, next) => {
    BlockedUsers.findOne({forUser: req.userData.userId}, (err, blockList) => {
        if(!blockList) next();
        else{
            let isInList = blockList.filter(el => {
                if(el.blockedUserId === req.body.userToCheck) return true
                else return false
            })

            if(isInList.length === 0){
                next();
            }
            else{
                res.json({
                    error: "user is blocked"
                })
            }
        }
    })

}

/*
    checking if the user from req.userData.userId has a blockList:
    yes: 
        cheking if the given userId in req.body.userToCheck is in the blockList:
            yes: 
                returning json error: "user is blocked"
            no: 
                calling next()
    no: 
        calling next();
*/