const express = require('express');
const router = express.Router();



const vehicles = require('../data/vehicles.js');


// GET all vehicles 
app.get('/all', (req, res) => {
    res.send( vehicles );
})


module.exports = router;
