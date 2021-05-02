const db = require("../db");

const schema = new db.Schema({
    content: {type: String, require: true},
    author: {type: String, require: true},
    blogId: {type: String, require: true}
  },
  {
    timestamps: true
  });

const Comment = db.model("Comment", schema);

module.exports = Comment;
