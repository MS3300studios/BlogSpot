const express = require('express');
const router = express();

const BlogLike = require('../models/BlogLike');
const BlogDislike = require('../models/BlogDislike');
const CommentLike = require('../models/CommentLike');
const CommentDislike = require('../models/CommentDislike');
const auth = require('../middleware/authorization');

router.use(express.json());

// BlogLikes

router.post('/blogLike/upvote', auth, (req, res) => {
    let checkIfLikedAlready = new Promise((resolve, reject) => {
        BlogLike.findOne({authorId: req.userData.userId, blogId: req.body.blogId})
        .then(blogLike => {
            resolve(blogLike)
        })
        .catch(err => {
            reject(err);
        });
    })

    let checkIfDislikedAlready = new Promise((resolve, reject) => {
        BlogDislike.findOne({authorId: req.userData.userId, blogId: req.body.blogId})
        .then(blogLike => {
            resolve(blogLike)
        })
        .catch(err => {
            reject(err);
        });
    })

    checkIfLikedAlready.then((blogLike, error)=>{
        if(blogLike){
            //already was liked
            checkIfDislikedAlready.then((blogDislike, error)=>{
                if(blogDislike){
                    //user disliked [impossible]
                    res.json({
                        message: "impossible scenario"
                    })
                }
                else if(blogDislike === null){
                    //user didn't dislike
                    BlogLike.findByIdAndDelete(blogLike._id)
                    .exec()
                    .then((deletedLike => {
                        console.log('deleted the like');
                        res.sendStatus(200);
                    }))
                    .catch(err => {
                        console.log("deleting error: ", err);
                        res.sendStatus(500);
                    })
                }
            })
        }
        else if(blogLike === null){
            //wasn't liked before
            checkIfDislikedAlready.then((blogDislike, error)=>{
                if(blogDislike){
                    //was disliked before 

                    //adding new like
                    const blogLike = new BlogLike({
                        authorId: req.userData.userId,
                        blogId: req.body.blogId
                    });
                
                    blogLike.save()
                        .then(response => {
                            // res.sendStatus(201);
                            console.log('created the like')
                            return;
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error: err});
                        });
                    
                    //deleting old dislike
                    BlogDislike.findByIdAndDelete(blogDislike._id)
                    .exec()
                    .then((deletedDislike => {
                        console.log('deleted the dislike and created the like');
                        res.sendStatus(201);
                    }))
                    .catch(err => {
                        console.log("deleting error: ", err);
                        res.sendStatus(500);
                    })
                }
                else if(blogDislike === null){
                    //adding new like
                    const blogLike = new BlogLike({
                        authorId: req.userData.userId,
                        blogId: req.body.blogId
                    });
                
                    blogLike.save()
                        .then(response => {
                            res.sendStatus(201);
                            console.log('created the like')
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error: err});
                        });
                }
            })
        }
    })
})

router.post('/blogLike/downvote', auth, (req, res) => {
    let checkIfLikedAlready = new Promise((resolve, reject) => {
        BlogLike.findOne({authorId: req.userData.userId, blogId: req.body.blogId})
        .then(blogLike => {
            resolve(blogLike)
        })
        .catch(err => {
            reject(err);
        });
    })

    let checkIfDislikedAlready = new Promise((resolve, reject) => {
        BlogDislike.findOne({authorId: req.userData.userId, blogId: req.body.blogId})
        .then(blogLike => {
            resolve(blogLike)
        })
        .catch(err => {
            reject(err);
        });
    })

    checkIfLikedAlready.then((blogLike, error)=>{
        if(blogLike){
            //already was liked
            checkIfDislikedAlready.then((blogDislike, error)=>{
                if(blogDislike){
                    //user disliked [impossible]
                    res.json({
                        message: "impossible scenario"
                    })
                }
                else if(blogDislike === null){
                    //user didn't dislike
                    BlogLike.findByIdAndDelete(blogLike._id)
                    .exec()
                    .then((deletedLike => {
                        console.log('deleted the like');
                        // res.sendStatus(200);
                        return;
                    }))
                    .catch(err => {
                        console.log("deleting error: ", err);
                        res.sendStatus(500);
                    })

                    const blogDislike = new BlogDislike({
                        authorId: req.userData.userId,
                        blogId: req.body.blogId
                    });
                
                    blogDislike.save()
                        .then(response => {
                            console.log('created the dislike and deleted the like')
                            res.sendStatus(201);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error: err});
                        });
                }
            })
        }
        else if(blogLike === null){
            //wasn't liked before
            checkIfDislikedAlready.then((blogDislike, error)=>{
                if(blogDislike){
                    //was disliked before 

                    //deleting old dislike
                    BlogDislike.findByIdAndDelete(blogDislike._id)
                    .exec()
                    .then((deletedDislike => {
                        console.log('deleted the dislike');
                        res.sendStatus(200);
                    }))
                    .catch(err => {
                        console.log("deleting error: ", err);
                        res.sendStatus(500);
                    })
                }
                else if(blogDislike === null){
                    //adding new dislike
                    const blogDislike = new BlogDislike({
                        authorId: req.userData.userId,
                        blogId: req.body.blogId
                    });
                
                    blogDislike.save()
                        .then(response => {
                            res.sendStatus(201);
                            console.log('created the dislike')
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error: err});
                        });
                }
            })
        }
    })
})

// CommentLikes

router.post('/commentLike/upvote', auth, (req, res) => {
    let checkIfLikedAlready = new Promise((resolve, reject) => {
        CommentLike.findOne({authorId: req.body.authorId, commentId: req.body.commentId})
        .then(commentLike => { 
            resolve(commentLike)
        })
        .catch(err => {
            reject(err);
        });
    })

    checkIfLikedAlready.then((commentLike, error)=>{
        if(commentLike){
            console.log("was already liked by user, so we need to delete");
            CommentLike.findByIdAndDelete(commentLike._id)
            .exec()
            .then((deletedLike => {
                res.sendStatus(200);
            }))
            .catch(err => {
                console.log("deleting error: ", err);
                res.sendStatus(500);
            })
        }
        else if(commentLike === null){
            console.log("wasn't liked by user, so we need to add");
            const commentLike = new CommentLike({
                authorId: req.body.authorId,
                commentId: req.body.commentId
            });
        
            commentLike.save()
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

router.post('/commentLike/downvote', auth, (req, res) => {

})

module.exports = router;
