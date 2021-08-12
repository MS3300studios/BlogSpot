const express = require('express');
const router = express();
const auth = require('../middleware/authorization');

const LastReadMessage = require('../models/lastReadMessage');

router.use(express.json());


router.post('/lastReadMessage/create', auth, (req, res) => {

})

router.post('/lastReadMessage/update', auth, (req, res) => {
    
})

router.get('/lastReadMessage/:conversationId/:authorId', auth, (req, res) => {
    console.log(req.body.params);
})

module.exports = router;