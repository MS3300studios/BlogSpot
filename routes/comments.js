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
            res.json({
                comment: response
            })
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
        })
})

router.post('/comments/getNumber', auth, (req, res) => {
    Comment.countDocuments({blogId: req.body.blogId})
    .then((count) => {
        return res.status(200).json({
            count: count
        });
    })
    .catch(error => {
        console.error(error)
    })
})

router.post('/comments/limited', auth, (req, res) => {
    let limit = req.body.limit;
    let blogId = req.body.blogId;
    Comment.find({blogId: blogId}).skip(limit).sort({ createdAt: -1 }).limit(4)
        .exec()
        .then(comments => {
            return res.status(200).json({
                comments: comments
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'comments not found',
                error: err
            });
        });
})

router.get('/comments/one/:commentId', auth, (req, res) => {
    Comment.findById({_id: req.params.commentId})
        .exec()
        .then(comment => {
            return res.status(200).json({
                comment: comment
            });
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
    Comment.deleteOne({_id: req.params.commentId})
        .exec()
        .then((response => {
            res.sendStatus(200);
        }))
        .catch(err => {
            console.log("deleting error: ", err);
            res.sendStatus(500);
        })
})

router.post('/comments/edit/:commentId', auth, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, {content: req.body.content})
    .exec()
        .then((response => {
            res.sendStatus(200);
        }))
        .catch(err => {
            console.log("deleting error: ", err);
            res.sendStatus(500);
        })
})

module.exports = router;
