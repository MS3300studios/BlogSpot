const db = require("../db");

const schema = new db.Schema({
    authorId: {type: String, require: true},
    blogId: {type: String, require: true}
  },
  {
    timestamps: true
  });

const BlogDislike = db.model("BlogDislike", schema);

module.exports = BlogDislike;
