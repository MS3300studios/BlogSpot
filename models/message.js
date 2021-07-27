const db = require("../db");

const schema = new db.Schema({
    authorId: {type: String, require: true},
    authorName: {type: String, require: true},
    content: {type: String, require: true},
    conversationId: {type: String, require: true},
    hour: {type: String, require: true}
  },
  {
    timestamps: true
  });

const Message = db.model("Message", schema);

module.exports = Message;
