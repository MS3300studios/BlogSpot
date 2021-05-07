const express = require('express');
const router = express();

const BlogLike = require('../models/BlogLike');
const CommentLike = require('../models/CommentLike');
const auth = require('../middleware/authorization');

router.use(express.json());

router.post('/commentLike/upvote', auth, (req, res) => {
    console.log(req.body)
    Comment.findByIdAndUpdate(req.params.commentId, {title: req.body.title, content: req.body.content})
    .exec()
        .then((response => {
            console.log(response);
            res.sendStatus(200);
        }))
        .catch(err => {
            console.log("deleting error: ", err);
            res.sendStatus(500);
        })
})

router.get('/comments/getNumber', function (req, res) {
    console.log('hello')
})

module.exports = router;
