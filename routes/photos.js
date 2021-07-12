const express = require('express');
const router = express();


const auth = require('../middleware/authorization');

const Module = require('../models/photo');
const Photo = Module.photo;
const PhotoComment = Module.photoComment;
const Like = Module.photoLike;
const Dislike = Module.photoDislike;

router.use(express.json());

//----------------------------------------------CREATING PHOTOS

router.post('/photo/new', auth, (req, res) => {
    const photo = new Photo({
        authorId: req.userData.userId,
        description: req.body.description,
        data: req.body.photoString, //base64 encoded
        likes: [],
        dislikes: [],
        comments: []
    })
    photo.save()
    .then(result => {
        console.log(result)
        res.sendStatus(201); //created
    })
    .catch(err => {
        console.log(err);
        res.json({error: err})
    });
})

router.delete('/photo/delete', auth, (req, res) => {
    Photo.findOneAndDelete({authorId: req.userData.userId})
        .then(response => {
            if(response){
                console.log('photo deleted');
                res.status(200);
            }
            else{
                console.log('photo deletion failed, photo was not found');
                res.status(404);
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500)
        });
})

//----------------------------------------------COMMENTS

router.post('/photo/addComment', auth, (req, res) => {
    if(req.body.content === ""){
        res.status(401);
    }
    else{
        Photo.findById(req.body.photoId, (err, photo) => {
            if(err) console.log(err)
            else{
                let comments = photo.comments;
                const photoComment = new PhotoComment({
                    authorId: req.userData.userId,
                    authorNick: req.body.nickname,
                    content: req.body.content
                })
                comments.push(photoComment);
                photo.comments = comments;
                photo.save().then(resp => {
                    res.status(201).json({
                        photo: resp
                    })
                })
            }
        })
    }
})

router.post('/photo/deleteComment', auth, (req, res) => { //photoId, content
    Photo.findById(req.body.photoId, (err, photo) => {
        if(err) console.log(err)
        else{
            let comments = photo.comments;
            let commentsMod = comments.filter((com, index) => {
                if(com.authorId === req.userData.userId && com.content === req.body.content){
                    return false
                }
                else return true
            })
            photo.comments = commentsMod;
            photo.save().then(resp => {
                res.status(200).json({
                    photo: photo
                })
            })
        }   
    })
})

//----------------------------------------------LIKES

//photoId, like=[bool]
router.post('/photo/rate', auth, (req, res) => { 

    Photo.findById(req.body.photoId, (err, photo) => {
        if(err) console.log(err)
        else{

            //checking for like with userId
            let likes = photo.likes;
            let hasLikedBefore = false;
            likes.forEach(like => {
                if(like.authorId === req.userData.userId) hasLikedBefore = true;
            })

            //checking for dislike with userId 
            let dislikes = photo.dislikes;
            let hasDislikedBefore = false;
            dislikes.forEach(dislike => {
                if(dislike.authorId === req.userData.userId) hasDislikedBefore = true;
            })

            if(req.body.like){
                if(hasLikedBefore){
                    console.log('user liked before, deleting like')
                    let newLikes = likes.filter(like => like.authorId !== req.userData.userId)
                    photo.likes = newLikes;
                    photo.save().then(resp => {
                        res.status(201).json({
                            photo: resp
                        })
                    })
                }
                else if(hasDislikedBefore){
                    console.log('user disliked before, deleting dislike, creating like')
                    let newDislikes = dislikes.filter(dislike => dislike.authorId !== req.userData.userId)
                    photo.dislikes = newDislikes;

                    const photoLike = new Like({
                        authorId: req.userData.userId,
                    })

                    likes.push(photoLike);
                    photo.likes = likes;
                    photo.save().then(resp => {
                        res.status(201).json({
                            photo: resp
                        })
                    })
                }
                else{
                    console.log('user didnt like before, creating like')
                    const photoLike = new Like({
                        authorId: req.userData.userId,
                    })
                    likes.push(photoLike);
                    photo.likes = likes;
                    photo.save().then(resp => {
                        res.status(201).json({
                            photo: resp
                        })
                    })
                }
            }
            else if(req.body.like === false){
                

                if(hasDislikedBefore){
                    console.log('user disliked before, deleting dislike')
                    let newDislikes = dislikes.filter(dislike => dislike.authorId !== req.userData.userId)
                    photo.dislikes = newDislikes;
                    photo.save().then(resp => {
                        res.status(201).json({
                            photo: resp
                        })
                    })
                }
                else if(hasLikedBefore){
                    console.log('user liked before, deleting like, creating dislike')
                    let newLikes = likes.filter(like => like.authorId !== req.userData.userId)
                    photo.likes = newLikes;

                    const photoDislike = new Dislike({
                        authorId: req.userData.userId,
                    })

                    dislikes.push(photoDislike);
                    photo.dislikes = dislikes;
                    photo.save().then(resp => {
                        res.status(201).json({
                            photo: resp
                        })
                    })

                }
                else{
                    console.log('user didnt dislike before, creating dislike')
                    const photoDislike = new Dislike({
                        authorId: req.userData.userId,
                    })
                    dislikes.push(photoDislike);
                    photo.dislikes = dislikes;
                    photo.save().then(resp => {
                        res.status(201).json({
                            photo: resp
                        })
                    })
                }

            }
        }
    })

})

//----------------------------------------------GETTING PHOTOS

//get limited, newest photos from all users
router.post('/photos/public/limited', auth, (req, res) => {
    let limit = req.body.limit;
    Photo.find().sort({ createdAt: -1 }).limit(limit)
        .exec()
        .then(photos => {
            return res.status(200).json({
                photos: photos
            });
        })
        .catch(err => {
            console.log(err);
            return res.json({
                message: 'photos not found',
                error: err
            });
        });
})

router.get('/photos/getone/:id', (req, res) => {
    Photo.findById(req.params.id, (err, photo) => {
        res.json({
            photo: photo
        })
    })
})

//sends newest, limited photos of a specific user
router.post('/photos/user/limited', auth, (req, res) => {
    let limit = req.body.limit;
    let author = req.body.authorId
    if(req.body.authorId === "self"){
        author = req.userData.userId
    }
    Photo.find({authorId: author}).sort({ createdAt: -1 }).limit(limit)
        .exec()
        .then(photos => {
            return res.status(200).json({
                photos: photos
            });
        })
        .catch(err => {
            console.log(err);
            return res.json({
                message: 'photos not found',
                error: err
            });
        });
})



module.exports = router;