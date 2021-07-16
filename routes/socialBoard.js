const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const PhotoModels = require('../models/photo');
const Photo = PhotoModels.photo;
const Blog = require('../models/blog');


router.use(express.json());

router.get('/socialBoard/init', auth, (req, res) => {
    Blog.find().skip(req.body.skip).exec().then(blogs => {
        // blogs.forEach((blog, index) => {
        //     const formatted = new Date(blog.createdAt).toLocaleDateString()
        //     console.log(`${index}) ${formatted} || ${blog.title}`)
        // })
        Photo.find().skip(req.body.skip).exec().then(photos=>{
            // photos.forEach((photo, index) => {
            //     const formatted = new Date(photo.createdAt).toLocaleDateString()
            //     console.log(`${index}) ${formatted} || ${photo.authorNickname}`)
            // })

            let newArr = blogs.concat(photos);
            // newArr.forEach((el, i) => {
            //     const formatted = new Date(el.createdAt).toLocaleDateString()
            //     let name;
            //     if(el.title !== undefined) name = el.title
            //     else name = el.authorNickname
            //     console.log(`${i}) ${formatted} || ${name}`)
            // })
            newArr.sort((a, b) => {
                let c = new Date(a.createdAt);
                let d = new Date(b.createdAt);
                return c-d
            })
            //newArr.forEach((el, index) => {
                // const formatted = new Date(el.createdAt).toLocaleDateString();
                // let name;
                //if(el.title !== undefined){
                    // name = el.title
                    //el.isBlog = true;
                //}
               // else {
                    //el.isBlog = false;
                    // name = el.authorNickname
                //} 
                // console.log(`${index}) ${formatted} || ${name} || isBlog: ${el.isBlog}`)
           // })

            // newArr.forEach(el => {
            //     console.log(el.isBlog)
            // })

            res.status(200).json({
                elements: newArr
            })
        })
    })
})



module.exports = router;