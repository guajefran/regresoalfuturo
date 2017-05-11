var express = require('express');
var router = express.Router();
var matchController = require('../controllers/matchController.js');


router.get('/', matchController.list);

router.post('/', matchController.create);

router.get('/:id', matchController.show);


module.exports = router;
