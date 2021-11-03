const express = require('express');
const router = express();
const auth = require('../middleware/authorization');

const LastReadMessage = require('../models/lastReadMessage');
const ConversationModule = require('../models/conversation');
const Message = require('../models/message');
const Conversation = ConversationModule.Conversation;

router.use(express.json());

const checkIfParticipant = (conversation, userId) => {
    let partic = false;
    conversation.participants.forEach(participant => {
        if(participant.userId === userId) partic = true;
    })

    return partic;
}

router.post('/lastReadMessage/create', auth, (req, res) => {
    //check if already exists, if true, UPDATE, if false CREATE
    Conversation.findOne({_id: req.body.conversationId}, async (err, conversation) => {
        if(!conversation) res.sendStatus(404); //this should not happen
        else{
            const isParticipant = await checkIfParticipant(conversation, req.userData.userId);
            if(isParticipant === true){
                LastReadMessage.findOne({conversationId: req.body.conversationId, userId: req.userData.userId}, (err, msg)=> {
                    if(!msg){
                        //create if lrm doesn't yet exists for this conversation
                        const lastReadMessage = new LastReadMessage({
                            conversationId: req.body.conversationId,
                            userId: req.userData.userId,
                            content: req.body.content
                        })
                        lastReadMessage.save().then(()=>res.sendStatus(201));
                    }
                    else{
                        //update lrm if it already exists for this conversation
                        msg.content = req.body.content;
                        msg.save().then(()=>res.sendStatus(200));
                    }
                })
            }
            else{
                res.sendStatus(401) //if user is not a participant of a conversation, he cannot read it's last message
            }
        }
    });
})

router.get('/lastReadMessage/:conversationId', auth, (req, res) => {
    Conversation.findById(req.params.conversationId).then(conversation => {
        let isParticipant = false;
        conversation.participants.forEach(participant => {
            if(participant.userId === req.userData.userId) isParticipant = true;
        })

        if(isParticipant === true){
            LastReadMessage.findOne({conversationId: req.params.conversationId, userId: req.userData.userId}).then(lastReadMessage => {
                if(!lastReadMessage){
                    res.json({
                        error: "no message was found"
                    });
                }
                else {
                    res.json(lastReadMessage);
                }
            });
        }
        else{
            res.sendStatus(401) //if user is not a participant of a conversation, he cannot read it's last message
        }
    })
})

//comparing last read messages with newest messages in conversation to determine wether there are any unread messages
router.get('/lastReadMessages/countUnread', auth, async(req, res) => {
    const conversations = await Conversation.find({"participants.userId": req.userData.userId }).exec();
    const lastmessages = await LastReadMessage.find({userId: req.userData.userId}).exec();
    const newestMessages = [];

    function getter(id){
        return new Promise((resolve, reject) => {
            Message.find({conversationId: id})
            .exec()
            .then(messages => {
                resolve(messages[messages.length-1]);
            })
            .catch(error => {
                reject(error.code);
            })
        })
    }
        
    async function looper(){
        for(let i=0; i<conversations.length; i++){
            const message = await getter(conversations[i]._id);
            newestMessages.push(message);
        }
        //if there are no messages in conversation then the field will be undefined
        let counter = 0;
        for(let i = 0; i < newestMessages.length; i++){
            if(newestMessages[i] === undefined) continue;
            else{
                for(let j = 0; j < lastmessages.length; j++){
                    if(newestMessages[i].conversationId === lastmessages[j].conversationId){
                        if(newestMessages[i].content !== lastmessages[j].content){
                            counter++;
                            break;
                        } 
                        else continue;
                    }
                    else continue;
                }
            }
        }

        res.json({count: counter});
    }
    
    looper();
})

module.exports = router;