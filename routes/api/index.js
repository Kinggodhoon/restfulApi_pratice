const router = require('express').Router();
const games = require('./games');

router.use('/games',games);

module.exports = router;