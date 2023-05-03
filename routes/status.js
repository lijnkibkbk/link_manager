const express = require('express');
const statusController = require("../controllers/statusController");
const router = express.Router();

router.post('/', statusController.ping);


module.exports = router;
