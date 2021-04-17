const db = require("../db");

const schema = new db.Schema({
    title: {type: String, require: true},
    content: {type: String, require: true},
    author: {type: String, require: true}
  },
  {
    timestamps: true
  });

const Blog = db.model("Blog", schema);

module.exports = Blog;
