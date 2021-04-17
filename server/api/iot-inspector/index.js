var express = require('express');
var controller = require('./iot-inspector.controller');

var router = express.Router();

router.get('/subscribe', controller.subscribeDevices);
router.get('/get_traffic', controller.getTraffic);

module.exports = router;
