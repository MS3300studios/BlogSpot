const { BlockedUsers } = require('../models/blockedUsers');

module.exports = (req, res, next) => {
    console.log('firing up~!')

    BlockedUsers.findOne({forUser: req.body.adressingUser}, (err, blockList) => {
        console.log('blockList: ', blockList)

        if(!blockList) next();
        else{
            console.log('doing else (bc found blocklist)')
            let isInList = blockList.blockedUsers.filter(el => {
                if(el.blockedUserId === req.userData.userId) return true
                else return false
            })

            console.log(isInList)

            if(isInList.length === 0){
                console.log('not bloookced!aahah')
                next();
            }
            else{
                console.log('blockeeed!')

                res.json({
                    error: "user is blocked"
                })
            }
        }
    })

}