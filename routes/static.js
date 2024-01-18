var express = require('express');
var router = express.Router();
const staBot = require('../models/staBot');
let bot = new staBot()


router.post('/tzDyna', async (req, res) => {    
    var result = await bot.chapters();
    res.status(200).send(result);
});

router.post('/tzChap', async (req, res) => {    
    var result = await bot.subChaps();
    res.status(200).send(result);
});

router.post('/getContents', async (req, res) => {    
    var TID = req.tongID;
    var HID = req.hisID;
    var result = await carrier.compContent(TID, HID);
    res.status(200).send(result);
});


module.exports = router;
