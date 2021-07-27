const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const Message = require('../models/message');

router.use(express.json());

router.get('/messages/:conversationId', auth, (req, res) => {
    
})

router.post('/socialBoard/init', auth, (req, res) => {
    Blog.find().skip(req.body.skipPosts).limit(4).exec().then(blogs => {
        Photo.find().skip(req.body.skipPhotos).limit(4).exec().then(photos=>{
            let newArr = blogs.concat(photos);
            newArr.sort((a, b) => {
                let c = new Date(a.createdAt);
                let d = new Date(b.createdAt);
                return c-d
            })

            newArr.forEach(el => {
                const formatted = new Date(el.createdAt).toLocaleDateString();
            })

            res.status(200).json({
                elements: newArr
            })
        })
    })
})

module.exports = router;