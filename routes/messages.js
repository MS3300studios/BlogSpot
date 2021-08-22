const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const Message = require('../models/message');
const LastReadMessage = require('../models/lastReadMessage');

router.use(express.json());

router.post('/messages', auth, (req, res) => {
    Message.find({conversationId: req.body.conversationId})
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
                    res.json({
                       message: "none",
                       isNew: false
                    });
                }
                else {
                    res.json({
                        message: message,
                        isNew: false
                    });
                } 
            }
            else{
                if(!message) {
                    res.json({
                        message: "none",
                        isNew: false
                    });
                } 
                else {
                    if(message.content === lrmsg.content){
                        res.json({
                            message: message,
                            isNew: false
                        });
                    }
                    else{
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