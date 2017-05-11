const express = require('express');
const router  = express.Router();
const Match = require('../models/Match.js')

router.get('/', (req, res, next) => {
  Match.find({}, (err, matches) => {
    if (err) { return next(err) }
    return res.render('index', {matches: matches});
  }).sort({date: 1}).limit(10)
})

module.exports = router;
