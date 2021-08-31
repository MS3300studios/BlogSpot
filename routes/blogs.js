const express = require('express');
const router = express();

const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const BlogLike = require('../models/BlogLike');
const BlogDislike = require('../models/BlogDislike');
const CommentLike = require('../models/CommentLike');
const CommentDislike = require('../models/CommentDislike');

const auth = require('../middleware/authorization');

router.use(express.json());

router.post('/blogs', auth, (req, res) => {
    Blog.find({author: req.body.authorId})
        .exec()
        .then(blogs => {
            return res.status(200).json({
                blogs: blogs
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'user not found',
                error: err
            })
        });
});


router.post('/blogs/limited', auth, (req, res) => {
    let limit = req.body.limit;
    let authorId = req.body.authorId;
    Blog.find({author: authorId}).skip(limit).sort({ createdAt: -1 }).limit(2)
        .exec()
        .then(blogs => {
            return res.status(200).json({
                blogs: blogs
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'user not found',
                error: err
            })
        });
})

//routes not requireing authorId:

router.get('/blogs/one/:blogId', auth, (req, res) => {
    Blog.findById({_id: req.params.blogId})
        .exec()
        .then(blog => {
            User.findById(blog.author, (error, user) => {
                res.json({
                    blog: blog,
                    authorData: user
                })
            })

        })
        .catch(err => {
            return res.status(404).json({
                message: 'blog not found',
                error: err
            })
        });
});

router.post('/blogs/new', auth, (req, res) => {
    User.findById(req.userData.userId, (err, user) => {
        console.log(user.nickname)

        const blog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.userData.userId,
            authorNickname: user.nickname
        });
    
        blog.save()
            .then(response => {
                res.sendStatus(201);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
    })
});

router.delete('/blogs/delete/:blogId', auth, (req, res) => {
    //deleting blog
 
    Blog.findByIdAndDelete(req.params.blogId, (err, blog) => {
        if(err) console.log(err)
        else {
            Comment.deleteMany({blogId: req.params.blogId}, (err2, comments) => {
                if(err2)console.log(err2);
                else{
                    console.log(comments);
                }   
            })  

            BlogLike.deleteMany({blogId: req.params.blogId}, (err3, blogLikes) => {
                if(err3) console.log(err3);
                else{
                    console.log(blogLikes);
                }
            })
            
            BlogDislike.deleteMany({blogId: req.params.blogId}, (err4, blogDislike) => {
                if(err4) console.log(err4);
                else{
                    console.log(blogDislike);
                }
            })
        }
    })


    // Blog.deleteOne({_id: req.params.blogId})
    //     .exec()
    //     .then((response => {
    //         res.sendStatus(200);
    //     }))
    //     .catch(err => {
    //         console.log("deleting error: ", err);
    //         res.sendStatus(500);
    //     })
})

router.post('/blogs/edit/:blogId', auth, (req, res) => {
    Blog.findByIdAndUpdate(req.params.blogId, {title: req.body.title, content: req.body.content})
    .exec()
        .then((response => {
            res.sendStatus(200);
        }))
        .catch(err => {
            console.log("deleting error: ", err);
            res.sendStatus(500);
        })
})

router.get('/myBlogs', auth, (req, res) => {
    Blog.find({author: req.userData.userId})
        .exec()
        .then(blogs => {
            return res.status(200).json({
                blogs: blogs
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'user not found',
                error: err
            })
        });
});

module.exports = router;