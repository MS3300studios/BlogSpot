const db = require("../db");

const schema = new db.Schema({
    receiverId: {type: String, require: true},
    senderId: {type: String, require: true},
    senderNick: {type: String, require: true},
    objectType: {type: String, require: true},
    objectId: {type: String, require: true},
    actionType: {type: String, require: true}
  },
  {
    timestamps: true
  });

const Notification = db.model("Notification", schema);

module.exports = Notification;
