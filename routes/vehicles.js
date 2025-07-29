const express = require('express');
const router = express.Router();



const vehicles = require('../data/vehicles.js');


// GET /all - return all vehicles 
router.get('/all', (req, res) => {
    res.send( vehicles );
});

// POST /new
router.post( '/new' , (req,res) => {
    vin = req.body.vin;
    model = req.body.Model; 
    fleetID = req.body.fleetID;
    operator = req.body.operator;
    regStatus = req.body.regStatus;

    let vehiclesObj = {
        vin ,
        model ,
        fleetID ,
        operator ,
        regStatus
    }

    vehicles.push( vehiclesObj );
} );

// GET /:{id} vehicle by ID
router.get('/:id', (req, res) => {
    let vehiclesID = req.params.id;
    let vehicleObj = vehicles.vehicles.find( (obj) => {
        obj.vin = vehiclesID;
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
