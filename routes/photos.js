const express = require('express');
const router = express();


const auth = require('../middleware/authorization');

const Module = require('../models/photo');
const Photo = Module.photo;
const PhotoComment = Module.photoComment;

router.use(express.json());

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

router.post('/photo/addComment', auth, (req, res) => {
    Photo.findById(req.body.photoId, (err, photo) => {
        if(err) console.log(err)
        else{
            let comments = photo.comments;
            console.log('previous comments: ', comments)
            const photoComment = new PhotoComment({
                authorId: req.userData.userId,
                content: req.body.content
            })
            comments.push(photoComment);
            photo.comments = comments;
            photo.save().then(resp => {
                console.log("response from saving photo comment", resp);
                // res.json({
                //     photo: resp
                // })
            })
        }
    })
})

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
        console.log(photo)
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