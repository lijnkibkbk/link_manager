const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController');
const {isAdmin} = require("../middleware/jwt");

router.get('/', isAdmin, tagsController.get);


module.exports = router;
