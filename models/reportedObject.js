const db = require("../db");

const schema = new db.Schema({
    senderId: {type: String, require: true},
    type: {type: String, require: true},
    objectId: {type: String, require: true},
    description: {type: String, require: true},
  },
  {
    timestamps: true
  });

const Notification = db.model("Notification", schema);

module.exports = Notification;
