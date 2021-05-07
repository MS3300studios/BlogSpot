const db = require("../db");

const schema = new db.Schema({
    authorId: {type: String, require: true},
    commentId: {type: String, require: true}
  },
  {
    timestamps: true
  });

const CommentDislike = db.model("CommentDislike", schema);

module.exports = CommentDislike;
