const express = require('express');
const router = express();

const comment = require('../models/comment');
const auth = require('../middleware/authorization');

router.use(express.json());

router.post('/comments/new', auth, (req, res) => {
    const comment = new comment({
        title: req.body.title,
        content: req.body.content,
        author: req.userData.userId
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
    comment.find({author: req.userData.userId})
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
    console.log(req.body)
    let limit = req.body.limit;
    comment.find({author: req.userData.userId}).sort({ createdAt: -1 }).limit(limit)
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
})

router.get('/comments/one/:commentId', auth, (req, res) => {
    comment.findById({_id: req.params.commentId})
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
    comment.deleteOne({_id: req.params.commentId})
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
    comment.findByIdAndUpdate(req.params.commentId, {title: req.body.title, content: req.body.content})
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