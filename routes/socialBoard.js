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

    let searching = (findData) => {
        Blog.find(findData).sort({createdAt: -1}).exec((err, blogs) => {
            if(err) console.log(err)

            Photo.find(findData).sort({createdAt: -1}).exec((err, photos) => {
                if(err) console.log(err)

                let resultArr = blogs.concat(photos);

                console.log(resultArr);
            })

        })
    }

    let data = {};

    switch (req.body.filterIn) {
        case "title":
            data = {
                "title": {"$regex": req.body.filterBy, "$options": "i"}
            };
            searching(data);
            break;
        case "author nickname":
            data = {
                "authorNickname": {"$regex": req.body.filterBy, "$options": "i"}
            };
            searching(data);
            break;
        case "id":
            data = {
                "_id": {"$regex": req.body.filterBy, "$options": "i"}
            };
            searching(data);
            break;
        default:
            break;
    }



    /*
    Blog.find({ 
            "name": {"$regex": req.body.searchString, "$options": "i"}
        }, (err, conversations)=>{
            if(err) console.log(err)
            else {
                res.json({conversations: conversations});
            }
        }
    )
    */


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