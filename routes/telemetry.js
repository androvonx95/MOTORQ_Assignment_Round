const express = require('express');
const router = express.Router();
const telemetry = require('../data/telemetry');


const alertModule = require('./alerts.js');
const validate = alertModule.validate;



// receive data for one vehicle
router.post('/', (req, res) => {
    console.log('Received body:', req.body); // Add this line
    const { vin, ...data } = req.body;
    if (!vin) {
        return res.status(400).json({ error: 'VIN is required' });
    }
    
    telemetry.addTelemetry( req.body );
    res.status(201).json({ message: 'Telemetry data received' });
});

// last 24h history
router.get('/:vin', (req, res) => {
    const vin = req.params.vin;
    const history = telemetry.getHistory(vin);
    
    if (history.length === 0) {
        return res.status(404).json({ error: 'No telemetry data found for this vehicle' });
    }
    
    res.json(history);
});

// Most recent reading
router.get('/:vin/latest', (req, res) => {
    const vin = req.params.vin;
    const latest = telemetry.getLatest(vin);
    
    if (!latest) {
        return res.status(404).json({ error: 'No telemetry data found for this vehicle' });
    }
    
    res.json(latest);
});

module.exports = router;
