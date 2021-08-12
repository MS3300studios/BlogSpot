const db = require("../db");

const schema = new db.Schema({
    authorId: {type: String, require: true},
    conversationId: {type: String, require: true},
    content: {type: String, require: true}
  },
  {
    timestamps: true
  });

const LastReadMessage = db.model("LastReadMessage", schema);

module.exports = LastReadMessage;
