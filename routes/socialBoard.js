const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const PhotoModels = require('../models/photo');
const Photo = PhotoModels.photo;
const Blog = require('../models/blog');


router.use(express.json());

router.post('/socialBoard/init', auth, (req, res) => {
    Blog.find().skip(req.body.skipPosts).limit(6).exec().then(blogs => {
        Photo.find().skip(req.body.skipPhotos).limit(6).exec().then(photos=>{
            let newArr = blogs.concat(photos);
            newArr.sort((a, b) => {
                let c = new Date(a.createdAt);
                let d = new Date(b.createdAt);
                return c-d
            })
            
            // newArr.forEach(el => {
            //     const formatted = new Date(el.createdAt).toLocaleDateString();
            // })
                
            newArr.reverse();
            
            res.status(200).json({
                elements: newArr
            })
        })
    })
})
  
    

router.post('/socialBoard/search', auth, (req, res) => {
    console.log(req.body.filterIn)
    console.log(req.body.filterBy)
    /*Blog.find({
        
    }).skip(req.body.skipPosts).limit(4).exec().then(blogs => {
        Photo.find().skip(req.body.skipPhotos).limit(4).exec().then(photos=>{
            let newArr = blogs.concat(photos);
            newArr.sort((a, b) => {
                let c = new Date(a.createdAt);
                let d = new Date(b.createdAt);
                return c-d
            })
            
            // newArr.forEach(el => {
            //     const formatted = new Date(el.createdAt).toLocaleDateString();
            // })
                
            newArr.reverse();
            
            res.status(200).json({
                elements: newArr
            })
        })
    })*/
})


module.exports = router;