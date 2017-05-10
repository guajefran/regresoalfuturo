var express = require('express');
var router = express.Router();
var teamController = require('../controllers/teamController.js');


router.get('/', teamController.list);
  
router.post('/', teamController.create);

router.get('/:id', teamController.show);




router.put('/:id', teamController.update);


router.delete('/:id', teamController.remove);

module.exports = router;
