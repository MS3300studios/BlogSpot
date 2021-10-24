const db = require("../db");
    
const bannedUserSchema = new db.Schema({ bannedUserId: {type: String}});

const schema = new db.Schema({
    bannedUsers: [bannedUserSchema]
});

const BannedUsers = db.model("BannedUsers", schema);
const BannedUser = db.model("BannedUser", bannedUserSchema); 

module.exports = {BannedUsers: BannedUsers, BannedUser: BannedUser};
