const express = require('express');
const router = express();
const auth = require('../middleware/authorization');

const Conversation = require('../models/conversation');

router.use(express.json());

router.post('/conversations/new', auth, (req, res) => {
    console.log(req.userData)
    const conversation = new Conversation({
        name: req.body.name,
        participants: req.body.participants,
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

})

//get one conversation by it's own ID
router.get('/conversation/:id', auth, (req, res) => {
    Conversation.findById(req.params.id).then(conversation => {
        res.json({
            conversation: conversation
        })
    })
})


module.exports = router;