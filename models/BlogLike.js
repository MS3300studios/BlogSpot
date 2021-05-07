const db = require("../db");

const schema = new db.Schema({
    authorId: {type: String, require: true},
    commentId: {type: String, require: true}
  },
  {
    timestamps: true
  });

const BlogLike = db.model("BlogLike", schema);

module.exports = BlogLike;
