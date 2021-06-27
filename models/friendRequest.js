const db = require("../db");

const schema = new db.Schema({
    userId: {type: String, require: true},
    friendId: {type: String, require: true}
  },
  {
    timestamps: true
  });

const FriendRequest = db.model("FriendRequest", schema);

module.exports = FriendRequest;
