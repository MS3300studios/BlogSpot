const express = require('express');
const router = express();

const auth = require('../middleware/authorization');
const Report = require('../models/reportedObject');

router.use(express.json());

router.post('/report', auth, (req, res) => {
    if(req.body.objectId === "none"){
        //reporting a bug
        const bugReport = Report({
            senderId: req.userData.userId,
            type: "bug",
            objectId: req.body.objectId,
            description: req.body.text,
        })

        bugReport.save()
        .then(result => {
            res.sendStatus(201); //created
        })
        .catch(err => {
            res.json({error: err})
        });

    }else{
        //reporting a user
        const userReport = Report({
            senderId: req.userData.userId,
            type: "user",
            objectId: req.body.objectId,
            description: req.body.text,
        })

        userReport.save()
        .then(result => {
            res.sendStatus(201); //created
        })
        .catch(err => {
            res.json({error: err})
        });

    }
})

router.delete('/reports/:id', (req, res) => {
    Report.findByIdAndDelete(req.params.id, (err, doc) => { 
        if(err) console.log(err);
        else res.sendStatus(200);
    });
})

router.get('/reports', (req,res) => {
    Report.find().exec().then(reports => {
        res.json(reports)
    }).catch(err => console.log(`[GETTING REPORTS FAILED]: ${err}`));
})

module.exports = router;