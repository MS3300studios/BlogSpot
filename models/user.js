const db = require("../db");

const schema = new db.Schema({
    name: {type: String, require: true},
    surname: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    nickname: {type: String, require: true, unique: true},
    
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