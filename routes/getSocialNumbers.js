const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const Friend = require('../models/friend');
const PhotoModule = require('../models/photo');
const Photo = PhotoModule.photo;
const Blog = require('../models/blog');

router.use(express.json());

router.post('/getSocialNumbers', auth, (req, res) => {
    //checking friends count

    Friend.countDocuments({userId: req.body.userId})
    .then((countFriends) => {
        Friend.countDocuments({friendId: req.body.userId})
            .then(countFriends2 => {
                let numOfFriends = countFriends+countFriends2;

                //checking blogs count
                Blog.countDocuments({author: req.body.userId})
                    .then(countBlogs => {

                        //cheking photos count 

                        Photo.countDocuments({authorId: req.body.userId})
                            .then(countPhotos => {

                                //sending numbers:

                                return res.status(200).json({
                                    friendsCount: numOfFriends,
                                    blogsCount: countBlogs,
                                    photosCount: countPhotos
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