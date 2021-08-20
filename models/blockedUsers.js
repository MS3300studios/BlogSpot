const db = require("../db");
    
const blockedUserSchema = new db.Schema({ blockedUserId: {type: String}});

const schema = new db.Schema({
    forUser: {type: String, require: true},
    blockedUsers: [blockedUserSchema]
});

const BlockedUsers = db.model("BlockedUsers", schema);
const BlockedUser = db.model("BlockedUser", blockedUserSchema);

module.exports = {BlockedUsers: BlockedUsers, BlockedUser: BlockedUser};
