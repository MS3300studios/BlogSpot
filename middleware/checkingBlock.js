const { BlockedUsers } = require('../models/blockedUsers');

module.exports = (req, res, next) => {
    
    BlockedUsers.findOne({forUser: req.body.adressingUser}, (err, blockList) => {
        if(!blockList) next();
        else{
            let isInList = blockList.blockedUsers.filter(el => {
                if(el.blockedUserId === req.userData.userId) return true
                else return false
            })

            if(isInList.length === 0){
                next();
            }
            else{

                res.status(403).json({
                    error: "user is blocked"
                })
            }
        }
    })

}