const db = require("../db");

const schema = new db.Schema({
    receiverId: {type: String, require: true},
    senderId: {type: String, require: true},
    senderNick: {type: String, require: true},
    type: {type: String, require: true},
    objectId: {type: String, require: true},
  },
  {
    timestamps: true
  });

const Message = db.model("Message", schema);

module.exports = Message;
