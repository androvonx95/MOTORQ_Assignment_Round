const express = require('express');
const router = express.Router();



const vehicles = require('../data/vehicles.js');


// GET /all - return all vehicles 
router.get('/all', (req, res) => {
    res.send( vehicles );
});

// POST /new
router.post('/new', (req, res) => {
    const vin = req.body.vin;
    const model = req.body.Model; 
    const fleetID = req.body.fleetID;
    const operator = req.body.operator;
    const regStatus = req.body.regStatus;

    const vehiclesObj = {
        vin,
        model,
        fleetID,
        operator,
        regStatus
    };

    vehicles.vehicles.push(vehiclesObj);

    // Send a success response
    res.status(201).json({
        message: "Vehicle added successfully",
        vehicle: vehiclesObj
    });
});


// GET /:{id} vehicle by ID
router.get('/:id', (req, res) => {
    let vehiclesID = req.params.id;
    let vehicleObj = vehicles.vehicles.find( (obj) => {
        return obj.vin === vehiclesID;
    } );
    if (vehicleObj){
        res.status( 200 );
        res.send( vehicleObj );
    }
    else{
        res.status( 404 );
        res.send( "vehicle not found" );       
    }

});


// DELETE /:{id} - Delete vehicle by ID
router.delete('/:id', (req, res) => {
    let vehiclesID = req.params.id;
    let index = vehicles.vehicles.findIndex( (obj) => {
        return obj.vin === vehiclesID;
    });
    
    if (index !== -1) {
        let deletedVehicle = vehicles.vehicles.splice(index, 1)[0];
        res.status(200);
        res.json(deletedVehicle);
    } else {
        res.status(404);
        res.json({ message: "Vehicle not found" });
    }
});


module.exports = router;
