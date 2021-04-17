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
                error: err
            })
        });
});

module.exports = router;