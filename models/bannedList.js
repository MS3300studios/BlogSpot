const db = require("../db");
const bannedUserSchema = new db.Schema({ bannedUserId: {type: String}});    
module.exports = db.model("BannedUser", bannedUserSchema);
