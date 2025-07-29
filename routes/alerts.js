const express = require('express');
const router = express.Router();


const data = require('../data/telemetry.js');
const alerts = require('../data/alerts.js');

// Telemetry info
// [
//     VIN
//     GPS coordinates : (latitude, longitude)
//     Speed : (current speed in km/h)
//     Engine status : (On/Off/Idle)
//     Fuel/Battery level :(percentage)
//     Odometer reading : (total kilometers)
//     Diagnostic codes :(if any errors)
//     Timestamp:
// ]


// Alert Info
// [

//     'id' : 
//     'vin' :
//     'type' :
//     'severity':
//     'timestamp':
// ]



function getTimeStamp(){
    return '2021-03-24T00:00:00'
}
// Validate Telemetry data and raise alert
function validate( obj ){
    let alertObj;
    // speed alert
    if ( obj.speed > 120 ){
        alertObj = {
            id : alerts.alerts.length,
            vin : obj.VIN,
            type: "Speed",
            severity : "High",
            timestamp: getTimeStamp()
        }
        alerts.push( alertObj );
    }

    // fuel alert
    if ( obj.fuel < 15 ){
        alertObj = {
            id : alerts.alerts.length,
            vin : obj.VIN,
            type: "Fuel",
            severity : "Medium",
            timestamp: getTimeStamp()
        }
        alerts.push( alertObj );
    }
}

// List all alerts
router.get('/all', (req, res) => {
  res.send( alerts );
})

// get alert by ID
router.get('/:id', (req, res) => {
    let alertID = parseInt(req.params.id);  // Convert to number

    if (alertID >= 0 && alertID < alerts.length) {
        res.send(alerts[alertID]);
    } else {
        res.status(404).json({ error: "Alert not found" });
    }

})


console.log( data );

module.exports = router;
