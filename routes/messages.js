const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const Message = require('../models/message');

router.use(express.json());

router.post('/messages/:conversationId', auth, (req, res) => {
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

router.get('/messages/latest/:conversationId', auth, (req, res) => {
    Message.find({conversationId: req.params.conversationId}).sort({ createdAt: -1}).limit(1).exec((err, message) => {
        res.json(message[0])
    })
})

module.exports = router;