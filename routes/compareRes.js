var express = require('express');
var router = express.Router();
const dbWorker = require('../models/dataRetriver');
let carrier = new dbWorker()


router.post('/getChaps', async (req, res) => {    
    var book = req.bookName;
    var result = await carrier.chapters(book);
    res.status(200).send(result);
});

router.post('/getSubChaps', async (req, res) => {    
    var chap = req.chapName;
    var result = await carrier.subChaps(chap);
    res.status(200).send(result);
});

router.post('/getContents', async (req, res) => {    
    var TID = req.tongID;
    var HID = req.hisID;
    var result = await carrier.compContent(TID, HID);
    res.status(200).send(result);
});


module.exports = router;

