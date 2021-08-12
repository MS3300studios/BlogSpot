const express = require('express');
const router = express();
const auth = require('../middleware/authorization');

const LastReadMessage = require('../models/lastReadMessage');
const ConversationModule = require('../models/conversation');
const Conversation = ConversationModule.Conversation;

router.use(express.json());


router.post('/lastReadMessage/create', auth, (req, res) => {
    //check if already exists, if true, UPDATE, if false CREATE
    Conversation.findById(req.body.conversationId).then(conversation => {
        let isParticipant = false;
        conversation.participants.forEach(participant => {
            if(participant.userId === req.userData.userId) isParticipant = true;
        })

        if(isParticipant === true){
            LastReadMessage.findByIdAndUpdate(req.body.conversationId, {content: req.body.content}, {upsert: true}, (err, msg) => {
                if(err) console.log(err)
                res.json({message: msg});
            })
        }
        else{
            res.sendStatus(401) //if user is not a participant of a conversation, he cannot read it's last message
        }
    })
    
})

router.post('/lastReadMessage/update', auth, (req, res) => {
    
})

router.post('/lastReadMessage/get', auth, (req, res) => {
    console.log(req.body.conversationId);
    console.log(req.userData.userId);
    // Conversation.findById(req.body.conversationId).then(conversation => {
    //     let isParticipant = false;
    //     conversation.participants.forEach(participant => {
    //         if(participant.userId === req.userData.userId) isParticipant = true;
    //     })

    //     if(isParticipant === true){
            
    //     }
    //     else{
    //         res.sendStatus(401) //if user is not a participant of a conversation, he cannot read it's last message
    //     }
    // })
})

module.exports = router;