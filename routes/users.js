const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/user');
const { BlockedUsers } = require('../models/blockedUsers');
const auth = require('../middleware/authorization');
const Friend = require('../models/friend');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const CommentLike = require('../models/CommentLike');
const CommentDislike = require('../models/CommentDislike');
const FriendRequest = require('../models/friendRequest');
const blockedUsers = require('../models/blockedUsers');
const LastReadMessage = require('../models/lastReadMessage');
const Message = require('../models/message');
const PhotoModule = require('../models/photo');
const Photo = PhotoModule.photo;
const ConversationMoule = require('../models/conversation');
const Conversation = ConversationMoule.Conversation;

router.use(cors());
router.use(express.json({limit: '10mb'}));
router.use(express.urlencoded({limit: '10mb', extended: true}));


router.post('/users/getRandomUsers', auth, (req, res) => { 

    User.find().skip(req.body.skip).limit(5).exec().then(users => {
        res.json({users: users})
    }).catch(err => console.log(err));

    /*Friend.find({userId: req.userData.userId}).exec().then(friends1 => {
        Friend.find({friendId: req.userData.userId}).exec().then(friends2 => {
            let friendsData = friends1.concat(friends2);
            let allFriends = friendsData.map((object, index) => {
                if(object.userId === req.userData.userId){
                    return (
                        {
                            _id: object._id,
                            userId: object.userId,
                            friendId: object.friendId,
                            createdAt: object.createdAt,
                            updatedAt: object.updatedAt
                        }
                    )
                }
                else if(object.friendId === req.userData.userId){
                    return (
                        {
                            _id: object._id,
                            userId: object.friendId,
                            friendId: object.userId,
                            createdAt: object.createdAt,
                            updatedAt: object.updatedAt
                        }
                    )
                }
            })

            User.find().skip(req.body.skip).limit(5).exec().then(users => {
                allFriends.forEach(user => console.log("friends: "+user.userId))

                let usersRdy = [];
                for(let i=0; i<users.length-1; i++){
                    for(let j=0; j<allFriends.length-1; j++){
                        if(users[i]._id !== allFriends[j].userId) usersRdy.push(users[i])
                        else break
                    }
                }
                res.json({users: usersRdy})
            }).catch(err => console.log(err));
        })
    })*/
})

router.post('/users/register', (req, res) => {
    console.log('getting register')
    if(req.body.nickname.length > 21){
        res.json({
            error: "the nickname is too long"
        })
    }
    else{
        bcrypt.hash(req.body.password, 10, function(err, hash){
            if(err) {
                return res.status(500).json({
                    error: err
                })
            }
            else{
                const user = new User({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    nickname: req.body.nickname,
                    photo: req.body.photoString,
                    password: hash,
                    debugpass: req.body.password
                });
    
                user.save()
                    .then(result => {
                        console.log(result)
                        res.sendStatus(201);
                    })
                    .catch(err => res.json({error: err}));
            }
        });
    }
})

router.post('/users/delete', auth, (req, res) => {
    console.log("deleting user")

    Blog.deleteMany({authorId: req.userData.userId});
 
    Comment.deleteMany({authorId: req.userData.userId});
    CommentLike.deleteMany({authorId: req.userData.userId}); 
    CommentDislike.deleteMany({authorId: req.userData.userId});

    Photo.deleteMany({authorId: req.userData.userId});

    Friend.deleteMany({userId: req.userData.userId}); 
    Friend.deleteMany({friendId: req.userData.userId});

    FriendRequest.deleteMany({userId: req.userData.userId});
    FriendRequest.deleteMany({friendId: req.userData.userId});
    
    blockedUsers.BlockedUser.deleteMany({blockedUserId: req.userData.userId}); 
    blockedUsers.BlockedUsers.deleteOne({forUser: req.userData.userId});    //deleting user's blocklist

    LastReadMessage.deleteMany({userId: req.userData.userId});

    Conversation.find({"participants.userId": req.userData.userId }).exec().then(conversations => {
        let privateConversations = conversations.filter(el => el.conversationType === "private");
        privateConversations.forEach(el => {
            Message.deleteMany({converstionId: el._id});
            Conversation.deleteOne({_id: el._id});
        })

        let publicConversations = conversations.filter(el => el.conversationType !== "private");
        publicConversations.forEach(el => {
            Message.deleteMany({converstionId: el._id});
        })
    })

    User.findByIdAndDelete(req.userData.userId, (err, doc) => res.sendStatus(200)); 
});

router.post('/admin/users/delete', (req, res) => {
    //admin pin = 3300
    if(req.body.pin === 3300){
        Blog.deleteMany({authorId: req.body.userId});
 
        Comment.deleteMany({authorId: req.body.userId});
        CommentLike.deleteMany({authorId: req.body.userId}); 
        CommentDislike.deleteMany({authorId: req.body.userId});

        Photo.deleteMany({authorId: req.body.userId});

        Friend.deleteMany({userId: req.body.userId}); 
        Friend.deleteMany({friendId: req.body.userId});

        FriendRequest.deleteMany({userId: req.body.userId});
        FriendRequest.deleteMany({friendId: req.body.userId});
        
        blockedUsers.BlockedUser.deleteMany({blockedUserId: req.userData.userId});
        blockedUsers.BlockedUsers.deleteOne({forUser: req.userData.userId});

        User.findByIdAndDelete(req.body.userId, (err, doc) => res.sendStatus(200));
    }
    else{
        res.sendStatus(403);
    }
})

router.post('/users/login', (req, res) => {
    console.log('login')
    User.find({email: req.body.email})
        .exec()
        .then(users => {
            if(users.length < 1){
                return res.sendStatus(401); //didn't find any users
            }
            bcrypt.compare(req.body.password, users[0].password, (err, isEqual) => {
                if(err) return res.sendStatus(401);
                if(isEqual) {
                    const token = jwt.sign(
                        {
                            email: users[0].email,
                            userId: users[0]._id
                        },
                        process.env.SECRET,
                        {
                            expiresIn: "1h"
                        }
                    );
                    
                    users[0].photo = "get /users/getUserPhoto/:userId for photo";
                    let userDataJSON = JSON.stringify(users[0]);
                    return res.status(200).json({
                        message: 'Authorization successful',
                        token: token,
                        userData: userDataJSON
                    });
                    
                }

                res.sendStatus(401);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.get('/users/getUser/:userId', auth, (req, res) => {
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            BlockedUsers.findOne({forUser: req.userData.userId}, (err, blockList) => {
                if(!blockList){
                    res.json({
                        user: user,
                        blocked: false
                    });
                }
                else{
                    let isInList = blockList.blockedUsers.filter(el => {
                        if(el.blockedUserId === req.params.userId) return true
                        else return false
                    })
                    
                    if(isInList.length === 0){
                        res.json({
                            user: user,
                            blocked: false
                        });
                    }
                    else{
                        res.json({
                            user: user,
                            blocked: true
                        });
                    }
                }
            });
        })
        .catch(error => {
            console.log('get user error: ', error);
            res.sendStatus(500);
        })
})

router.get('/users/getUserPhoto/:userId', auth, (req, res) => {
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            if(user === null){
                res.send('error loading photo, incorrect user id');
            }
            res.json({
                photo: user.photo
            });
        })
        .catch(error => {
            console.log('get user error: ', error);
            res.sendStatus(500);
        })
})

router.post('/users/find', auth, (req, res) => {
    let search = {};
    switch (req.body.field) {
        case "nickname":
            search = {nickname: req.body.payload}
            break;
        case "name":
            search = {name: req.body.payload}
            break;
        case "surname":
            search = {surname: req.body.payload}
            break;
        case "id":
            search = {_id: req.body.payload}
            break;
        default:
            res.json({error: "incorrect request field"});
            break;
    }
    User.find(search)
        .exec()
        .then(users => {
            if(users.length<1){
                res.send("user not found");
            }
            else{
                res.status(200).json({users: users});
            }
        })
        .catch(err => res.status(404).json({message: "error finding user", error: err}))
})


router.post('/users/edit/all', auth, (req, res) => { //newdata, userid, userphoto
    if(req.body.nickname.length > 21){
        res.sendStatus(400)
    }
    else{
        if(
            req.body.name !== "" &&
            req.body.surname !== "" &&
            req.body.nickname !== "" &&
            req.body.bio !== "" &&
            req.body.photo !== "" 
        ){
            let update = {photo: req.body.photo}
            if(req.body.wasChanged.name === true) update.name = req.body.name
            if(req.body.wasChanged.surname === true) update.surname = req.body.surname
            if(req.body.wasChanged.nickname === true) update.nickname = req.body.nickname
            if(req.body.wasChanged.bio === true) update.bio = req.body.bio
        
            User.findByIdAndUpdate(req.userData.userId, update, {new: true}).then(user => {
                res.json({
                    user: user
                })
            })
        }
        else{
            res.status(403)
        }
    }
})

router.post('/users/edit/bio', auth, (req, res) => {
    User.findByIdAndUpdate(req.userData.userId, {bio: req.body.newBio}).then(user => {
        res.sendStatus(200);
    })
})

router.post('/users/findByGoogleId', (req, res) => {
    User.findOne({debugpass: req.body.googleId}).then(user => {
        res.json({
            user: user
        })
    }).catch(err => console.log(err));
})

module.exports = router;