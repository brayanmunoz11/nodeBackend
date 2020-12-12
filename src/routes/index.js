const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('bienenido a mi API');
});

module.exports = router;