const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const Message = require('../models/message');
const LastReadMessage = require('../models/lastReadMessage');

router.use(express.json());

router.get('/messages/:conversationId', auth, (req, res) => {
    Message.find({conversationId: req.params.conversationId})
        .sort({ createdAt: -1})
        .skip(req.body.skip)
        .limit(10)
        .exec((err, messages) => {
            messages.reverse();
            res.json({
                messages: messages
            });
        })
})

//redundant: messages are saved directly during sending the message to the websocket 
router.post('/messages/add', auth, (req, res) => {
    const message = new Message({
        authorId: req.body.authorId,
        authorName: req.body.authorName,
        content: req.body.content,
        conversationId: req.body.conversationId,
        hour: req.body.hour
    });

    message.save().then(resp => {
        res.sendStatus(201);
    })
})

router.post('/messages/latest', auth, (req, res) => {
    Message.findOne({conversationId: req.body.conversationId}).sort({ createdAt: -1}).limit(1).exec((err, message) => {
        LastReadMessage.findOne({userId: req.userData.userId, conversationId: req.body.conversationId}).then(lrmsg => {
            if(!lrmsg){
                if(!message){
                    console.log('no message, no lastRead message')
                    res.json({
                       message: "none",
                       isNew: false
                    });
                }
                else {
                    console.log('message exists, but theres no lastRead message')
                    res.json({
                        message: message,
                        isNew: false
                    });
                } 
            }
            else{
                if(!message) {
                    console.log('no message, but lastRead message exists')
                    res.json({
                        message: "none",
                        isNew: false
                    });
                } 
                else {
                    console.log('message exists, and lastRead message exists')
                    if(message.content === lrmsg.content){
                        console.log('messages are the same')
                        res.json({
                            message: message,
                            isNew: false
                        });
                    }
                    else{
                        console.log("messages are different")
                        res.json({
                            message: message,
                            isNew: true
                        });
                    }
                }
            }
        });

    })
})

module.exports = router;