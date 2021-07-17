const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const Friend = require('../models/friend');
const Photo = require('../models/photo');
const Blog = require('../models/blog');

router.use(express.json());

router.post('/getSocialNumbers/numberOfFriends', auth, (req, res) => {
    Friend.countDocuments({userId: req.body.userId})
    .then((count) => {
        Friend.countDocuments({friendId: req.body.userId})
            .then(count2 => {
                let numOfFriends = count+count2;
                return res.status(200).json({
                    count: numOfFriends
                });
            })
            .catch(error => {
                console.error(error)
            })
    })
    .catch(error => {
        console.error(error)
    })
})

// router.post('/getSocialNumbers/numberOfBlogs', auth, (req, res) => {
//     Blog.find().skip(req.body.skipPosts).limit(4).exec().then(blogs => {
//         Photo.find().skip(req.body.skipPhotos).limit(4).exec().then(photos=>{
//             let newArr = blogs.concat(photos);
//             newArr.sort((a, b) => {
//                 let c = new Date(a.createdAt);
//                 let d = new Date(b.createdAt);
//                 return c-d
//             })

//             newArr.forEach(el => {
//                 const formatted = new Date(el.createdAt).toLocaleDateString();
//                 console.log(`${formatted}`);
//             })

//             res.status(200).json({
//                 elements: newArr
//             })
//         })
//     })
// })

// router.post('/getSocialNumbers/numberOfPhotos', auth, (req, res) => {
//     Blog.find().skip(req.body.skipPosts).limit(4).exec().then(blogs => {
//         Photo.find().skip(req.body.skipPhotos).limit(4).exec().then(photos=>{
//             let newArr = blogs.concat(photos);
//             newArr.sort((a, b) => {
//                 let c = new Date(a.createdAt);
//                 let d = new Date(b.createdAt);
//                 return c-d
//             })

//             newArr.forEach(el => {
//                 const formatted = new Date(el.createdAt).toLocaleDateString();
//                 console.log(`${formatted}`);
//             })

//             res.status(200).json({
//                 elements: newArr
//             })
//         })
//     })
// })


module.exports = router;