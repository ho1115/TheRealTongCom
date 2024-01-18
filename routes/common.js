var express = require('express');
var router = express.Router();

router.post('/versionChange', async function (req, res, next) {
    console.log('changing Version');
    try {
        req.Version === 'all' ? res.end('not') : res.end('all')
    }
    catch (error) {
        console.log(error);
    }
});

module.exports = router;
