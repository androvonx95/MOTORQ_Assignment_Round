const express = require('express');
const router = express.Router();



const telemetry = require('../data/telemetry.js');
const vehicles = require('../data/vehicles.js');
const alerts = require('../data/alerts.js');


console.log( telemetry );
console.log( vehicles );
console.log( alerts );

module.exports = router;
