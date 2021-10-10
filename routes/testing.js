const express = require('express');
const router = express();

const TestingModel = require('../models/testingModel');

router.use(express.json());

router.post('/testing', function(req, res){
    const model = TestingModel({value: req.body.val});
    model.save().then((e)=>console.log('model was saved to db\n '+e)).catch(err => console.log(err));
})

module.exports = router;