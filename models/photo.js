const db = require("../db");

const likeSchema = new db.Schema({ authorId: {type: String}});
const dislikeSchema = new db.Schema({ authorId: {type: String}});

const schema = new db.Schema({
    authorId: {type: String, require: true},
    description: {type: String},
    data: {type: String, require: true},
    likes: [likeSchema],
    dislikes: [dislikeSchema]
  },
  {
    timestamps: true
  });

const Photo = db.model("Photo", schema);

module.exports = Photo;
