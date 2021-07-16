const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const PhotoModels = require('../models/photo');
const Photo = PhotoModels.photo;
const Blog = require('../models/blog');


router.use(express.json());

router.get('/socialBoard/init', auth, (req, res) => {
    Blog.find().skip(req.body.skip).exec().then(blogs => {
        Photo.find().skip(req.body.skip).exec().then(photos=>{
            let newArr = blogs.concat(photos);
            newArr.sort((a, b) => {
                let c = new Date(a.createdAt);
                let d = new Date(b.createdAt);
                return c-d
            })

            res.status(200).json({
                elements: newArr
            })
        })
    })
})



module.exports = router;