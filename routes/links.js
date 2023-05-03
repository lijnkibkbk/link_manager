const express = require('express');
const router = express.Router();
const linksController = require('../controllers/linksController');
const {isAdmin} = require("../middleware/jwt");

router.get('/', linksController.getAll);
router.post('/', isAdmin, linksController.create);
router.get('/:id', linksController.get);
router.patch('/:id', isAdmin, linksController.update);
router.delete('/:id', isAdmin, linksController.delete);


module.exports = router;
