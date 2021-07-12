const db = require("../db");

const likeSchema = new db.Schema({ authorId: {type: String}});
const dislikeSchema = new db.Schema({ authorId: {type: String}});
const commentSchema = new db.Schema({
    authorId: {type: String},
    authorNick: {type: String},
    content: {type: String}
  },
  {
    timestamps: true
  });

const schema = new db.Schema({
    authorId: {type: String, require: true},
    description: {type: String},
    data: {type: String, require: true},
    likes: [likeSchema],
    dislikes: [dislikeSchema],
    comments: [commentSchema]
  },
  {
    timestamps: true
  });

const Photo = db.model("Photo", schema);
const PhotoComment = db.model("PhotoComment", commentSchema);
const PhotoLike = db.model("PhotoLike", likeSchema);
const PhotoDislike = db.model("PhotoDislike", dislikeSchema);

module.exports = {
  photo: Photo,
  photoComment: PhotoComment,
  photoLike: PhotoLike,
  photoDislike: PhotoDislike
}