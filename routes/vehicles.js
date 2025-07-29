const express = require('express');
const router = express.Router();



const vehicles = require('../data/vehicles.js');


// GET all vehicles 
router.get('/all', (req, res) => {
    res.send( vehicles );
});

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


router.get('/:id', (req, res) => {
    vehiclesID = req.params.id;
    vehicles.vehicles.find( (obj) => {
        obj.vin = vehiclesID;
    } );
    res.send( vehicles );
});
module.exports = router;
