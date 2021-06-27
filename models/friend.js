const db = require("../db");

const schema = new db.Schema({
    userId: {type: String, require: true},
    friendId: {type: String, require: true}
  },
  {
    timestamps: true
  });

const Friend = db.model("Friend", schema);

module.exports = Friend;
