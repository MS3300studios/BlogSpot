const express = require('express');
const router = express();

const BlogLike = require('../models/BlogLike');
const CommentLike = require('../models/CommentLike');
const auth = require('../middleware/authorization');

router.use(express.json());

// BlogLikes

router.post('/blogLike/upvote', (req, res) => {
    let checkIfLikedAlready = new Promise((resolve, reject) => {
        BlogLike.findOne({authorId: req.body.authorId, blogId: req.body.blogId})
        .then(blogLike => {
            resolve(blogLike)
        })
        .catch(err => {
            reject(err);
        });
    })

    checkIfLikedAlready.then((blogLike, error)=>{
        if(blogLike){
            console.log("was already liked by user, so we need to delete");
            BlogLike.findByIdAndDelete(blogLike._id)
            .exec()
            .then((deletedLike => {
                res.sendStatus(200);
            }))
            .catch(err => {
                console.log("deleting error: ", err);
                res.sendStatus(500);
            })
        }
        else if(blogLike === null){
            console.log("wasn't liked by user, so we need to add");
            const blogLike = new BlogLike({
                authorId: req.body.authorId,
                blogId: req.body.blogId
            });
        
            blogLike.save()
                .then(response => {
                    res.sendStatus(201);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                });
        }
    })
})

router.post('/blogLike/upvote/remove', auth, (req, res) => {

})

// CommentLikes

router.post('/commentLike/downvote', auth, (req, res) => {
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

router.post('/commentLike/upvote/remove', auth, (req, res) => {
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
