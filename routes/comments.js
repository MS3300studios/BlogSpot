const express = require('express');
const router = express();

const Comment = require('../models/comment');
const auth = require('../middleware/authorization');

router.use(express.json());

router.post('/comments/new', auth, (req, res) => {
    if(req.body.content === ""){
        res.sendStatus(500)
    }
    const comment = new Comment({
        content: req.body.content,
        author: req.userData.userId,
        authorNick: req.body.authorNick,
        blogId: req.body.blogId
    });

    comment.save()
        .then(response => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.get('/comments', auth, (req, res) => {
    Comment.find({author: req.userData.userId})
        .exec()
        .then(comments => {
            return res.status(200).json({
                comments: comments
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'user not found',
                error: err
            })
        });
});

router.post('/comments/limited', auth, (req, res) => {
    let limit = req.body.limit;
    let blogId = req.body.blogId;
    Comment.find({blogId: blogId}).sort({ createdAt: -1 }).limit(limit)
        .exec()
        .then(comments => {
            return res.status(200).json({
                comments: comments
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'comments not found',
                error: err
            })
        });
})

router.get('/comments/one/:commentId', auth, (req, res) => {
    Comment.findById({_id: req.params.commentId})
        .exec()
        .then(comment => {
            return res.status(200).json({
                comment: comment
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(404).json({
                message: 'comment not found',
                error: err
            })
        });
});

router.delete('/comments/delete/:commentId', auth, (req, res) => {
    console.log(req.params.commentId)
    Comment.deleteOne({_id: req.params.commentId})
        .exec()
        .then((response => {
            console.log('deleted?')
            console.log('response: \n', response);
            res.sendStatus(200);
        }))
        .catch(err => {
            console.log("deleting error: ", err);
            res.sendStatus(500);
        })
})

router.post('/comments/edit/:commentId', auth, (req, res) => {
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

module.exports = router;