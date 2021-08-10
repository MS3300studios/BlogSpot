const express = require('express');
const router = express();
const auth = require('../middleware/authorization');

const convModels = require('../models/conversation');
const Conversation = convModels.Conversation;
const Participant = convModels.Participant;
const User = require('../models/user');

router.use(express.json());

router.post('/conversations/new', auth, (req, res) => {
    const conversation = new Conversation({
        name: req.body.name,
        participants: req.body.participants,
        type: "group"
    });

    conversation.save()
        .then(conversation => {
            res.status(201).json({
                conversation: conversation
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//get multiple conversations that have the userId as one of the users in participants array
router.get('/conversations/', auth, (req, res) => {
    Conversation.find({ "participants.userId": req.userData.userId }).exec().then(conversations => {
        res.json({
            conversations: conversations
        })
    })
})

//get one conversation by it's own ID
router.get('/conversation/:id', auth, (req, res) => {
    Conversation.findById(req.params.id).then((conversation) => {
        console.log(conversation)

        if(!conversation){
            res.status(200).json({
                error: "no conversation with this ID was found"
            })
        }
        else{
            res.status(200).json({
                conversation: conversation
            })
        }
    }).catch(error => res.json({
        error: "This is not a valid ID"
    }))
})

//search conversations matching name
router.post('/conversations/search', auth, (req, res) => {
    Conversation.find({ 
            "name": {"$regex": req.body.searchString, "$options": "i"}
        }, (err, conversations)=>{
            if(err) console.log(err)
            else {
                res.json({conversations: conversations});
            }
        }
    )
})

router.post('/conversation/edit/name/:id', auth, (req, res) => {
    Conversation.findById(req.params.id).then(conversation => {
        let isParticipant = false;
        conversation.participants.forEach(participant => {
            if(participant.userId === req.userData.userId) isParticipant = true;
        })

        if(isParticipant === true){
            conversation.name = req.body.newName;
            conversation.save().then(resp => {
                res.status(200).json({
                    conversation: resp
                })
            })
        }
        else{
            res.sendStatus(401) //if user is not a participant of a conversation, he cannot change its name 
        }
    })
})

router.post('/conversation/edit/participants/add/:id', auth, (req, res) => {
    Conversation.findById(req.params.id).then(conversation => {
        let isParticipant = false;
        conversation.participants.forEach(participant => {
            if(participant.userId === req.userData.userId) isParticipant = true;
        })

        if(isParticipant === true){
            let newParticipants = conversation.participants;
            for(let i=0; i<req.body.participantsToAdd.length; i++){
                newParticipants.push(req.body.participantsToAdd[i]);
            }
            conversation.participants = newParticipants;
            conversation.save().then(resp => {
                res.status(200).json({
                    conversation: resp
                })
            })
        }
        else{
            res.sendStatus(401) //if user is not a participant of a conversation, he cannot change its name 
        }
    })
});

//only for private conversations
router.get('/conversation/delete/:id', auth, (req, res) => {
    Conversation.findById(req.params.id).then(conversation => {
        let isParticipant = false;
        conversation.participants.forEach(participant => {
            if(participant.userId === req.userData.userId) isParticipant = true;
        })

        if(isParticipant === true){
            Conversation.findByIdAndDelete(req.params.id).then(conversation => {
                res.sendStatus(200);
            })
        }
        else{
            res.sendStatus(401) //if user is not a participant of a conversation, he cannot leave it 
        }
    })
})

router.get('/conversation/leave/:id', auth, (req, res) => {
    /*  
        TO BE DONE: check the length of the conversation, if the length is <=1 then delete the conversation.
    */
    Conversation.findById(req.params.id).then(conversation => {
        let isParticipant = false;
        conversation.participants.forEach(participant => {
            if(participant.userId === req.userData.userId) isParticipant = true;
        })

        if(isParticipant === true){
            let newParticipants = conversation.participants.filter(participant => participant.userId !== req.userData.userId);
            conversation.participants = newParticipants;
            conversation.save().then(()=>{
                res.sendStatus(200);
            }).catch(err => console.log(err))
        }
        else{
            res.sendStatus(401) //if user is not a participant of a conversation, he cannot leave it 
        }
    })
})

router.post('/conversation/join/:id', auth, (req, res) => {
    Conversation.findById(req.params.id).then(conversation => {
        let isParticipant = false;
        conversation.participants.forEach(participant => {
            if(participant.userId === req.userData.userId) isParticipant = true;
        })

        if(isParticipant === false){
            let newParticipants = conversation.participants;
            const newParticipant = new Participant({
                name: req.body.name,
                userId: req.userData.userId
            })

            newParticipants.push(newParticipant);
            conversation.participants = newParticipants;
            conversation.save().then(()=>{
                res.sendStatus(200);
            }).catch(err => console.log(err))
        }
        else{
            res.sendStatus(401) //if user is already a participant of a conversation, he cannot join it again
        }
    })
})

router.post('/conversations/checkPrivate', auth, (req, res) => {
    Conversation.find({ 
        conversationType: "private",
        $and: [ {"participants.userId": req.body.friendId}, {"participants.userId": req.body.userId} ] 
    }).then(async(conversation) => {
        if(conversation.length === 0){
            let newParticipants = [];
            let firstName = await User.findById(req.body.friendId).catch(err => res.sendStatus(400));
            let secondName = await User.findById(req.body.userId).catch(err => res.sendStatus(400));
            if(firstName === null || secondName === null) res.sendStatus(400);
            else{
                let firstParticipant = new Participant({
                    name: firstName.name,
                    userId: req.body.friendId
                })
                let secondParticipant = new Participant({
                    name: secondName.name,
                    userId: req.body.userId
                })
                newParticipants.push(firstParticipant, secondParticipant);
    
                const newConv = new Conversation({
                    name: "",
                    participants: newParticipants,
                    conversationType: "private"
                });
            
                newConv.save()
                    .then(conversation => {
                        res.status(201).json({
                            conversation: conversation
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    }); 
            }
        }
        else{
            res.json({
                conversation: conversation[0]
            })
        }
    }).catch(err => console.log(err))
})

module.exports = router;