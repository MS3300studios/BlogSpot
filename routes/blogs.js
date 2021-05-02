const express = require('express');
const router = express();

const Blog = require('../models/blog');
const auth = require('../middleware/authorization');

router.use(express.json());

router.post('/blogs/new', auth, (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.userData.userId
    });

    blog.save()
        .then(response => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.get('/blogs', auth, (req, res) => {
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

router.post('/blogs/limited', auth, (req, res) => {
    let limit = req.body.limit;
    Blog.find({author: req.userData.userId}).sort({ createdAt: -1 }).limit(limit)
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

router.get('/blogs/one/:blogId', auth, (req, res) => {
    Blog.findById({_id: req.params.blogId})
        .exec()
        .then(blog => {
            return res.status(200).json({
                blog: blog
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(404).json({
                message: 'blog not found',
                error: err
            })
        });
});

router.delete('/blogs/delete/:blogId', auth, (req, res) => {
    console.log(req.params.blogId)
    Blog.deleteOne({_id: req.params.blogId})
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

router.post('/blogs/edit/:blogId', auth, (req, res) => {
    console.log(req.body)
    Blog.findByIdAndUpdate(req.params.blogId, {title: req.body.title, content: req.body.content})
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