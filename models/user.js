const db = require("../db");

const schema = new db.Schema({
    name: {type: String, require: true},
    surname: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    nickname: {type: String, require: true, unique: true},
    bio: {type: String, require: false, unique: false}
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