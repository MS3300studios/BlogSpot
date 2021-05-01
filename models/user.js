const db = require("../db");

const schema = new db.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nickname: {type: String, required: true, unique: true},
    bio: {type: String, required: false, default: "this user keeps an air of mystery about him"}
  },
  {
    timestamps: true
  });

const User = db.model("User", schema);

module.exports = User;

// userPhoto: {
//   data: Buffer,
//   contentType: String,
//   require: true
// }